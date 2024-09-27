var mongoose = require("mongoose");
mongoose
  .connect("mongodb+srv://admin:admin@cluster0.c18jqog.mongodb.net/sample")
  .then(() => {
    console.log("Mongoose Connected");
  });

var Schema = mongoose.Schema;

var taskSchema = new Schema({
  AssignedTo: String,
  Status: String,
  DueDate: Date,
  Priority: String,
  Comments: String,
  Description: String,
});

var TaskModel = mongoose.model("tasks", taskSchema);


var express = require("express");
var cors = require("cors");
var app = express();
app.use(express.json());
app.use(cors());

app.post("/tasks/add", async (req, res) => {
  try {
    var addTask = await TaskModel.create(req.body);
    if (!addTask) {
      return res.status(400).send("Invalid Data");
    }
    res.status(201).send(addTask);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/tasks/all", async (req, res) => {
  try {
    var allTasks = await TaskModel.find();
    if (!allTasks) {
      return res.status(404).send("No Data Found");
    }
    res.send(allTasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/tasks/id/:id", async (req, res) => {
  try {
    var taskById = await TaskModel.findById(req.params.id);
    if (!taskById) {
      return res.status(404).send("Not Found");
    }
    res.send(taskById);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put("/tasks/update/:id", async (req, res) => {
  try {
    var updatedTask = await TaskModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedTask) {
      return res.status(404).send("Invalid data");
    }
    res.status(200).send(updatedTask);
  } catch (error) {
    res.status(403).send("Update failed...");
  }
});

app.delete("/tasks/delete/:id", async (req, res) => {
  try {
    var deletedTask = await TaskModel.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).send("Not Found");
    }
    res.status(200).send("Task deleted successfully");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});