module.exports = {
                  service           : "SES",
                  host              : "email-smtp.us-west-2.amazonaws.com",
                  port              : 587,
                  secureConnection  : false,
                  //name: "servername",
                  auth: {
                          user: "AKIAJKORSFHUALWMOGOA",
                          pass: "AgYuP3kHPUeCJWyYxVCP/ixk2PKBx4l32D5dnXR9RqJR"
                        },
                  ignoreTLS         : false,
                  debug             : false,
                  maxConnections    : 5 // Default is 5
}
