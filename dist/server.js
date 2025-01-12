"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_source_1 = require("./data-source");
const user_1 = __importDefault(require("./routes/user"));
const upload_1 = __importDefault(require("./routes/upload"));
const code_1 = __importDefault(require("./routes/admin/code"));
const users_1 = __importDefault(require("./routes/admin/users"));
const fetch_1 = __importDefault(require("./routes/fetch"));
const safety_1 = __importDefault(require("./routes/safety"));
const delete_1 = __importDefault(require("./routes/delete"));
const payment_1 = __importDefault(require("./routes/admin/premium/payment"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
(0, data_source_1.connectDatabase)();
app.use('/api/v1', user_1.default, upload_1.default, delete_1.default);
app.use('/api/admin', code_1.default, users_1.default);
app.use('/api/middleware', safety_1.default);
app.use('/api/gateway', payment_1.default);
// This is just for serving the files
app.use('/', fetch_1.default);
app.listen(process.env.PORT || 3000, () => {
    console.log(`The cdn backend api is now running and is connected to the Mongo User Database`);
});
