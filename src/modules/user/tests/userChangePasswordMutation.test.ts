import bcrypt from 'bcryptjs'
import faker from 'faker'
import { Connection } from "typeorm"
import { User } from '../../../entity/users'
import { graphCall } from "../../../test-utils/gCall"
import { testConn } from "../../../test-utils/testConfig"
import { createForgotPasswordUrl } from '../../../utils/generateUrls'

let connection: Connection

beforeAll(async () => {
    connection = await testConn()
})

afterAll(async () => {
    await connection.close()
})

const loginMutation = `
mutation Login($data: changePasswordInput!) {
  resetPassword(
    data: $data
  ) {
    id
    username
    email
  }
}
`;

describe("Reset Password", () => {
    it("should reset password", async () => {
        const password = faker.internet.password()
        const user = await User.create({
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: await bcrypt.hash(password, 12),
            confirmed: true
        }).save()

        const url = await createForgotPasswordUrl(user.id)
        const token = url.split('change-password/')[1]

        const response = await graphCall({
            source: loginMutation,
            variableValues: {
                data: {
                    password,
                    token
                }
            },
            userId: user.id
        })

        expect(response).toMatchObject({
            data: {
                resetPassword: {
                    id: `${user.id}`,
                    username: user.username,
                    email: user.email
                }
            }
        })

    })
})