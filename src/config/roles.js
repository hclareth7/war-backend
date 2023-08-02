const AccessControl = require("accesscontrol");
const ac = new AccessControl();
 
exports.roles = (function() {
ac.grant("supervisor")
 .readOwn("user")
 .updateOwn("user")
 
ac.grant("admin")
.extend("supervisor")
.createAny("user")
.readAny("user")
.updateAny("user")
 
ac.grant("root")
 .extend("supervisor")
 .deleteAny("user")
 
return ac;
})();