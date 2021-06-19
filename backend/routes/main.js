const router = require("express").Router();
const User = require("../model/User");
const statuses = require("../model/Status");
const verify = require("./verifyToken");
const jwt = require("jsonwebtoken");

const userFieldsToDisplay = { name: 1, email: 1, status: 1, _id: 0 };

async function getLoggedInUserId(req) {
  const decoded = jwt.verify(
    req.header("auth-token"),
    process.env.TOKEN_SECRET
  );

  return decoded._id;
}

async function getLoggedInUser(req) {
  return await User.findById(await getLoggedInUserId(req), userFieldsToDisplay);
}

function isStatusValid(req) {
  return Object.values(statuses).indexOf(req.body.status) > -1;
}

router.get("/getCurrentUserInfo", verify, async (req, res) => {
  const user = await getLoggedInUser(req);
  res.json(user);
});

// Changing user status
router.post("/changeUserStatus", verify, async (req, res) => {
  if (!isStatusValid(req)) {
    return res.status(400).send("Status is incorrect");
  }

  const userId = await getLoggedInUserId(req);

  User.findOneAndUpdate(
    { _id: userId },
    { $set: { status: req.body.status } },
    { new: true },
    function (err, doc) {
      if (err) return res.send(500, { error: err });
      return res.send("Succesfully saved.");
    }
  );
});

// Getting the list of all users
router.get("/getAllUsers", verify, async (req, res) => {
  const userId = await getLoggedInUserId(req);

  const all = await User.find({ _id: { $ne: userId } }, userFieldsToDisplay);
  res.json(all);
});

// TESTED
router.get("/getUsersByName", verify, async (req, res) => {
  const userId = await getLoggedInUserId(req);

  User.find(
    {
      name: new RegExp("^" + req.body.name, "i"),
      _id: { $ne: userId },
    },
    userFieldsToDisplay,
    function (err, usersByName) {
      if (err) {
        res.json(err);
      }
      res.send(usersByName);
    }
  );
});

// TESTED
router.get("/getUsersByEmail", verify, async (req, res) => {
  const userId = await getLoggedInUserId(req);

  User.find(
    {
      email: new RegExp("^" + req.body.email + "$", "i"),
      _id: { $ne: userId },
    },
    userFieldsToDisplay,
    function (err, usersByEmail) {
      if (err) {
        res.json(err);
      }

      res.send(usersByEmail);
    }
  );
});

// TESTED
router.get("/getUsersByStatus", verify, async (req, res) => {
  if (!isStatusValid(req)) {
    return res.status(400).send("Status is incorrect");
  }

  const userId = await getLoggedInUserId(req);

  User.find(
    {
      status: new RegExp("^" + req.body.status + "$", "i"),
      _id: { $ne: userId },
    },
    userFieldsToDisplay,
    function (err, usersByStatus) {
      if (err) {
        console.log("Error");
        res.json(err);
      }

      res.send(usersByStatus);
    }
  );
});

module.exports = router;
