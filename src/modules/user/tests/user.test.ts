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

const userQuery = `
{
  User {
    id
    username
    email
  }
}
`;

describe("User", () => {
    it("should get user", async () => {
        const user = await User.create({
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: await bcrypt.hash(faker.internet.password(), 12)
        }).save()

        const response = await graphCall({
            source: userQuery,
            userId: user.id
        })

        expect(response).toMatchObject({
            data: {
                User: {
                    id: `${user.id}`,
                    username: user.username,
                    email: user.email
                }
            }
        })
    })

    it("return null", async () => {

        const response = await graphCall({
            source: userQuery
        })
        expect(response).toMatchObject({
            data: {
                User: null
            }
        })
    })
})
