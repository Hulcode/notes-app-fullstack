const router = require("express").Router();
const controller = require("./routesControler");
const { jwtCheck } = require("../../utilities");
router.post("/create-account", (req, res) => {
  controller.createAccountPost(req, res);
});

router.post("/login", (req, res) => {
  controller.loginAccountPost(req, res);
});

router.get("/get-user", jwtCheck, (req, res) => {
  controller.getUser(req, res);
});
router.post("/add-note", jwtCheck, (req, res) => {
  controller.addNotePost(req, res);
});
router.put("/update-note/:id", jwtCheck, (req, res) => {
  controller.updateNotePut(req, res);
});
router.get("/all-notes", jwtCheck, (req, res) => {
  controller.getAllNotes(req, res);
});
router.delete("/delete-note/:id", jwtCheck, (req, res) => {
  controller.deleteNoteDelete(req, res);
});

router.put("/update-note/:id", jwtCheck, (req, res) => {
  controller.updateNotePut(req, res);
});
router.put("/update-pinned/:id", jwtCheck, (req, res) => {
  controller.updatePinPut(req, res);
});

router.post("/logout", jwtCheck, (req, res) => {
  controller.logoutPost(req, res);
});
router.post("/search-notes", jwtCheck, (req, res) => {
  controller.postSearchNotes(req, res);
});

module.exports = router;
