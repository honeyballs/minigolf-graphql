db.createCollection('user')
db.createCollection('club')
db.createCollection('coursetype')
db.createCollection('course')

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

relations:
-denormalized (komplette objekt informationen im objekt speichern)
	-schnell für read
	-effektiv, wenn sich die Werte gar nicht oder sehr selten ändern
-normalized (nur die id auf ein anderes objekt im objekt speichern)
