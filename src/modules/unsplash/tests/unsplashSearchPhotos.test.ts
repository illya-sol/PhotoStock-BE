import bcrypt from 'bcryptjs'
import faker from 'faker'
import { Connection } from "typeorm"
import { User } from '../../../entity/users'
import { graphCall } from '../../../test-utils/gCall'
import { testConn } from "../../../test-utils/testConfig"
import { unsplashOutput } from '../inputs/unsplashOutput'

let connection: Connection

beforeAll(async () => {
    connection = await testConn()
})

afterAll(async () => {
    await connection.close()
})

const searchPhotosQuery = `
query ListPhotos($data: unsplashSearchInput!){
    searchPhotos(
      data: $data
    ) {
      id
      width
      height
      description
      urls{
          regular
      }
      likes
      user {
          id
          username
      }
    }
  }
`

describe("Search photos", () => {
    it("should get list of photos", async () => {
        const user = await User.create({
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: await bcrypt.hash(faker.internet.password(), 12),
            confirmed: true
        }).save()

        const response = await graphCall({
            source: searchPhotosQuery,
            variableValues: {
                data: {
                    keyword: "cats",
                    page: 1,
                    perPage: 2
                }
            },
            userId: user.id
        })

        let out: [unsplashOutput] = response.data!.searchPhotos as [unsplashOutput]

        out.map(element => {
            expect(element).toMatchObject({
                id: element.id
            })
        });
    })

    it("should return null", async () => {
        const user = await User.create({
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: await bcrypt.hash(faker.internet.password(), 12),
            confirmed: true
        }).save()

        const response = await graphCall({
            source: searchPhotosQuery,
            variableValues: {
                data: {
                    keyword: "someUnsearchableString",
                    page: 1,
                    perPage: 1
                }
            },
            userId: user.id
        })

        expect(response).toMatchObject({
            data: {
                searchPhotos: []
            }
        })
    })
})  