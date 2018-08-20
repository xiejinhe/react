const router = require('express').Router()
const axios = require('axios')

const baseUrl = 'https://cnodejs.org/api/v1'

router.post('/login', function (req, res, next) {
  console.log(res)
  axios.post(`${baseUrl}/accesstoken`, {
    accesstoken: req.body.accessToken
  }).then(resp => {
    if (resp.status === 200 && resp.data.success) {
      req.session.user = {
        accessToken: req.body.accessToken,
        loginName: resp.data.loginname,
        id: resp.data.id,
        avatarUrl: resp.data.avatar_url
      }
      res.json({
        success: true,
        data: resp.data
      })
    }
  }).catch(err => {
    if (err.respone) {
      console.log(err.respone)
      res.json({
        success: false,
        data: err.respone.data
      })
    } else {
      next(err)
    }
  })
})

module.exports = router
