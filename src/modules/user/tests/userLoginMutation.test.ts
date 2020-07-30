import bcrypt from 'bcryptjs'
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

const loginMutation = `
mutation Login($data: LoginInput!) {
  login(
    data: $data
  ) {
    id
    username
    email
  }
}
`;

describe("Login", () => {
    it("should login user", async () => {
        const password = faker.internet.password()
        const user = await User.create({
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: await bcrypt.hash(password, 12),
            confirmed: true
        }).save()

        const response = await graphCall({
            source: loginMutation,
            variableValues: {
                data: {
                    username: user.username,
                    email: user.email,
                    password: password
                }
            }
        })

        expect(response).toMatchObject({
            data: {
                login: {
                    id: `${user.id}`,
                    username: user.username,
                    email: user.email
                }
            }
        })

    })
})