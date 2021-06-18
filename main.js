Parse.Cloud.define("getServerTime", function(request, response) {
    var dateToday = new Date();
    response.success(dateToday);
});

///////////////
/// creditUser
Parse.Cloud.define("creditUser", function(request, response) {
    var userId = request.params.userId,
        credit = request.params.credit,
        creditKey = request.params.creditKey;

    var User = Parse.Object.extend("_User"),
        user = new User({ objectId: userId });

    user.set(creditKey, credit);
    Parse.Cloud.useMasterKey();
    user.save().then(function(user) {
        response.success(user);
    }, function(error) {
        response.error(error)
    });
});

///////////////
/// creditUser
Parse.Cloud.define("setupLastReward", function(request, response) {
    var userId = request.params.userId;
    var loyaltyStartingDate = new Date(2020,8,1); // 8 is sept in javascript 0,1,2..11

    var User = Parse.Object.extend("_User"),
        user = new User({ objectId: userId });

    user.set("lastReward", loyaltyStartingDate);
    user.set("totalRewards", 0);
    Parse.Cloud.useMasterKey();
    user.save().then(function(user) {
        response.success(user);
    }, function(error) {
        response.error(error)
    });
});

/////////////////
/// assignAdmin
Parse.Cloud.define("assignAdmin", function(request, response) {
    var userId = request.params.userId,
        companyId = request.params.companyId;

    var User = Parse.Object.extend("_User"),
        user = new User({ objectId: userId });

    var Company = Parse.Object.extend("Company"),
        company = new Company({ objectId: companyId });

    user.set("companyObj", company);
    user.set("userType", "b");
    
    Parse.Cloud.useMasterKey();
    user.save().then(function(user) {
        response.success(user);
    }, function(error) {
        response.error(error)
    });
});

/////////////////
/// assignDriver
Parse.Cloud.define("assignDriver", function(request, response) {
    var userId = request.params.userId,
        companyId = request.params.companyId;

    var User = Parse.Object.extend("_User"),
        user = new User({ objectId: userId });

    var Company = Parse.Object.extend("Company"),
        company = new Company({ objectId: companyId });

    user.set("companyObj", company);
    user.set("userType", "d");

    Parse.Cloud.useMasterKey();
    user.save().then(function(user) {
        response.success(user);
    }, function(error) {
        response.error(error)
    });
});


/////////////////
/// divorceDriver
Parse.Cloud.define("divorceDriver", function(request, response) {
    var userId = request.params.userId;

    var User = Parse.Object.extend("_User"),
        user = new User({ objectId: userId });

    user.unset("companyObj");
    user.unset("userType");
    Parse.Cloud.useMasterKey();
    user.save().then(function(user) {
        response.success(user);
    }, function(error) {
        response.error(error)
    });
});

/////////////////
/// divorceAdmin
Parse.Cloud.define("divorceAdmin", function(request, response) {
    var userId = request.params.userId;

    var User = Parse.Object.extend("_User"),
        user = new User({ objectId: userId });

    user.unset("companyObj");
    user.unset("userType");
    Parse.Cloud.useMasterKey();
    user.save().then(function(user) {
        response.success(user);
    }, function(error) {
        response.error(error)
    });
});

//////////////////
// Email sendTemplate
Parse.Cloud.define("sendTemplate", function(request, response) {
    var Mandrill = require("./mandrillTemplateSend.js");

    Mandrill.initialize("ykkCy1qANN7b2hkYgD4kQw");
    Mandrill.sendTemplate({
                          key:"ef82aaf0e2dcddf5b129f18bdff9310f-us12",
                          template_name: request.params.templateName,
                          template_content: [{
                                             name: "example name",
                                             content: "example content" //Those are required but they are ignored
                                             }],
                          message: {
                          from_email: request.params.fromEmail,
                          from_name: request.params.fromName,
                          subject: request.params.subject,
                          to: [{
                               email: request.params.toEmail,
                               name: request.params.toName
                               }],
                          important: true,
                          global_merge_vars:[
                                             {
                                             name: "headerTitle",
                                             content: request.params.headerTitle
                                             },
                                             {
                                             name: "dayAndTime",
                                             content: request.params.dayAndTime
                                             },
                                             {
                                             name: "dayAndTimePickup",
                                             content: request.params.dayAndTimePickup
                                             },
                                             {
                                             name: "dayAndTimeDropoff",
                                             content: request.params.dayAndTimeDropoff
                                             },
                                             {
                                             name: "address",
                                             content: request.params.address
                                             },
                                             {
                                             name: "orderDetails",
                                             content: request.params.orderDetails
                                             },
                                             {
                                             name: "priceAndPayment",
                                             content: request.params.priceAndPayment
                                             },
                                             {
                                             name: "invitecode",
                                             content: request.params.invitecode
                                             }
                                             ]
                          },
                          async: false
                          }, {
                          success: function (httpResponse) {
                          console.log(httpResponse);
                          response.success("Email sent!");
                          },
                          error: function (httpResponse) {
                          console.error(httpResponse);
                          response.error("Uh oh, something went wrong");
                          }
                          });
                   });
