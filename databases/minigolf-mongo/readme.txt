db.createCollection('user')
db.createCollection('club')
db.createCollection('coursetype')

db.user.insert(
{
        name: "Mathias",
        email: "test@test.de",
        passwordHash: "1234",
        birthday: "1991-02-12",
        gender: "m",
        regKey: "",
        active: 1,
        role: 0,
        logins: 0,
        registration: "2017-10-21 16:13:00"
    }
)

localhost:8080/grapiql
query:
{
  name: users {
    name,
    gender
  }
}