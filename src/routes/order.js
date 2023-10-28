const { requireSignin, userMiddleware } = require("../common-middleware");
const { addOrder, getOrders, getOrder , getOrders1 , getAllOrders,updaterefundOrders} = require("../controller/order");
const router = require("express").Router();

router.post("/addOrder", requireSignin, userMiddleware, addOrder);
router.get("/getOrders", getAllOrders);
router.post("/order/getAllOrders", getAllOrders);
router.put("/order/:orderID", updaterefundOrders);
router.get("/getOrders1", requireSignin, userMiddleware, getOrders1);
router.post("/getOrder", requireSignin, userMiddleware, getOrder);

module.exports = router;
