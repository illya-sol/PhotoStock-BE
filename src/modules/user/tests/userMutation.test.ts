import faker from 'faker'
import { Connection } from "typeorm"
import { User } from '../../../entity/users'
import { graphCall } from "../../../test-utils/gCall"
import { testConn } from "../../../test-utils/testConfig"

let connection: Connection

beforeAll(async () => {
    connection = await testConn()
})

afterAll(async () => {
    await connection.close()
})

const registerMutation = `
mutation Register($data: RegisterInput!) {
  register(
    data: $data
  ) {
    id
    email
    username
  }
}
`;

describe("Register", () => {
    it("create user", async () => {
        const user = {
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        }
        const response = await graphCall({
            source: registerMutation,
            variableValues: {
                data: user
            }
        })

        expect(response).toMatchObject({
            data: {
                register: {
                    username: user.username,
                    email: user.email
                }
            }
        })

        const dbUser = await User.findOne({ where: { email: user.email } })
        expect(dbUser).toBeDefined()
        expect(dbUser!.confirmed).toBeFalsy()
        expect(dbUser!.username).toBe(user.username)
        expect(dbUser!.email).toBe(user.email)

    })
})