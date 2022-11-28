const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");


// UPDATE USER
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {

        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);

                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch(error) {
                return res.status(500).json(error);
            }
        }

        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });

            console.log(user);

            res.status(200).json("Account has been updated");
        } catch(error) {
            return res.status(500).json(error);
        }
    } else {
        return res.status(403).json("You can update only your account");
    }
})

// DELETE USER
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {

        try {
            const user = await User.findByIdAndDelete(req.params.id);

            console.log(user);

            res.status(200).json("Account has been deleted");
        } catch(error) {
            return res.status(500).json(error);
        }
    } else {
        return res.status(403).json("You can delete only your account");
    }
})

// GET USER
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const {password, updatedAt, ...other} = user._doc;
        res.status(200).json(other);
    } catch (error) {
        res.status(500).json(error);
    }
})

// FOLLOW A USER
router.put("/:id/follow", async (req, res) => {

    if (req.body.userId !== req.params.id) {

        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({$push: {followers: req.body.userId}});
                await currentUser.updateOne({$push: {following: req.params.id}});
                res.status(200).json("user has been followed");
            } else {
                res.status(403).json("You already follow this user")
            }
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("You can't follow yourself");
    }
})


// UNFOLLOW A USER
router.put("/:id/unfollow", async (req, res) => {
    
    if (req.body.userId !== req.params.id) {

        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({$pull: {followers: req.body.userId}});
                await currentUser.updateOne({$pull: {following: req.params.id}});
                res.status(200).json("user has been unfollowed");
            } else {
                res.status(403).json("You don't follow this user")
            }
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("You can't unfollow yourself");
    }
})


module.exports = router