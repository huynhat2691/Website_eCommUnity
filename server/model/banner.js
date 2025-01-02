// // models/Banner.js
// const mongoose = require("mongoose");

// const bannerSchema = new mongoose.Schema(
//   {
//     image: {
//       type: String,
//       // required: true,
//     },
//     title: {
//       type: String,
//       // required: true,
//     },
//     subtitle: String,
//     link: String,
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//     order: {
//       type: Number,
//       default: 1,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Banner", bannerSchema);

const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      // required: true,
    },
    title: {
      type: String,
      // required: true,
    },
    subtitle: String,
    link: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 1,
    },
    type: {
      type: String,
      enum: ['carousel', 'popup'],
      default: 'carousel'
    },
    popupFrequency: {
      type: String,
      enum: ['always', 'once_per_session', 'once_per_day'],
      default: 'always'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);