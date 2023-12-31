const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const myPlaintextPassword = "s0//P4$$w0rD";
const someOtherPlaintextPassword = "not_bacon";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, //공백 없애기
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  var user = this;
  if (user.isModified("password")) {
    //비밀번호 암호화
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  //plainPassword 1234567 암호화된 비밀번호 머시기

  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  //jsonwebtoken 이용해 token 생성
  var token = jwt.sign(user._id.toHexString(), "secretToken");

  user.token = token;

  user
    .save()
    .then(() => {
      return cb(null, user);
    })
    .catch((err) => {
      return cb(err);
    });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;

  //토큰 decode
  jwt.verify(token, "secretToken", function (err, decoded) {
    //유저 아이디 이용해 유저를 찾은 다음
    //클라이언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인

    user.findOne({ _id: decoded, token: token })
    .then((user)=>{
      cb(null, user);
    })
    .catch((err)=>{
      return cb(err);
    })
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
