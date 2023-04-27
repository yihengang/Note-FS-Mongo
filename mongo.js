//node helper program

const mongoose = require("mongoose")

if (process.argv.length < 3) {
  console.log("give password as argument")
  process.exit(1)
}

//Code assumes it will be passed the password from the credentials we created in MongoDB Atlas, as a command line parameter. We can access the command line parameter like this:
const password = process.argv[2]

//address of database we supplying to this MongoDB client library
const url = `mongodb+srv://casonyiheng:${password}@firstcluster.ti835nk.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set("strictQuery", false)
//establishing connection to the databse
mongoose.connect(url)

//Defining schema for a note, storing it in noteScheme var. Schema tells mongoose how note objects are to be stored in the database
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

//Defining Note model. First parameter is name of the model. Name of the collection will be 'notes', Mnongoose convention is to auto-name collections as the plural (e.g.notes) when schema refers to them in the singular (e.g.Note)
const Note = mongoose.model("Note", noteSchema)

const note = new Note({
  content: "Cason is going to finish chapter three before heading back",
  important: true,
})

//Models are so-called constructor functions that create new JavaScript objects based on the provided parameters. Since the objects are created with the model's constructor function, they have all the properties of the model, which include methods for saving the object to the database.

// note.save().then((result) => {
//   console.log("note saved!");
//   console.log(result);
//   //if connection not closed, program will never finish its execution
//   mongoose.connection.close();
// });

Note.find({ important: true }).then((result) => {
  result.forEach((note) => {
    console.log(note)
  })
  mongoose.connection.close()
})
