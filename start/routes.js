"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

// Route.post('/register', 'UserController.register')
// Route.post('/login', 'UserController.login')
// Route.put('/make-admin/:id', 'UserController.makeAdmin')

Route.post('/register', 'AuthController.register')
Route.post('/login', 'AuthController.login')
Route.post('/logout', 'AuthController.logout').middleware(['auth']);
Route.get('/profile', 'AuthController.profile').middleware(['auth']);
Route.put('users/update-password', 'AuthController.changePassword').middleware(['auth']);
// Route.post('/forgot-password', 'AuthController.forgotPassword')
// Route.post('/reset-password', 'AuthController.resetPassword')

Route.group(() => {
  Route.post('customer', 'TestCustomerController.store')
  // Route.put('customer', 'TestCustomerController.store')
  Route.get("/customer/profile", "TestCustomerController.show")
}).middleware(['auth'])



Route.get('check-user-registration', 'TestCustomerController.checkUserRegistration').middleware(['auth']);


Route.get('/test-hash', async ({ response }) => {
  const Hash = use('Hash')
  const password = 'password123'

  const hashedPassword = await Hash.make(password)
  console.log('Hashed password:', hashedPassword)

  return response.send({
    message: 'Password hashed successfully',
    hashedPassword
  })
})

Route.get("/sync-google-sheet", "CustomerController.syncData");
// Route.get("customers", "CustomerController.getCustomers");
// Route.get("customers/:id/address", "CustomerController.getCustomerAddress");
// Route.get("customers-hhb", "CustomerController.getCustomersHHB");

Route.group(() => {
  Route.get("", "CustomerController.index");
  // Route.post("", "CustomersController.store");
  Route.get("/:id", "CustomerController.show");
  Route.put("/:id", "CustomerController.update");
  Route.delete("/:id", "CustomerController.destroy");
}).prefix("/customers");

// Route.get("/sync-google-sheet-test", "TestController.syncData");
Route.get("tests", "TestController.getTests");

Route.post("/sale-records", "SaleRecordAffController.store");
Route.get("/sale-records", "SaleRecordAffController.index");
Route.put("/sale-records/:id", "SaleRecordAffController.update");
Route.put(
  "/sale-records/:id/payment-status",
  "SaleRecordAffController.updatePaymentStatus"
);
Route.delete("/sale-records/:id", "SaleRecordAffController.deleteSaleRecord");

Route.get("sales/daily", "SaleRecordAffController.getDailySales");
Route.get("sales/all-daily", "SaleRecordAffController.getAllSales");

Route.get("/promotion-types", "PromotionTypeController.index");
Route.post("/promotion-types", "PromotionTypeController.store");
Route.get("/promotion-types/:id", "PromotionTypeController.show");
Route.put("/promotion-types/:id", "PromotionTypeController.update");
Route.delete("/promotion-types/:id", "PromotionTypeController.destroy");

Route.get("/programs", "ProgramController.index");
Route.post("/programs", "ProgramController.store");
Route.get("/programs/:id", "ProgramController.show");
Route.put("/programs/:id", "ProgramController.update");
Route.delete("/programs/:id", "ProgramController.destroy");

Route.get("/packages", "PackageController.index");
Route.post("/packages", "PackageController.store");
Route.get("/packages/:id", "PackageController.show");
Route.put("/packages/:id", "PackageController.update");
Route.delete("/packages/:id", "PackageController.destroy");

Route.get("/packages/sync-data", "PackageController.syncData");

Route.group(() => {
  Route.get("", "PackageTypeController.index");
  Route.post("", "PackageTypeController.store");
  Route.get("/:id", "PackageTypeController.show");
  Route.put("/:id", "PackageTypeController.update");
  Route.delete("/:id", "PackageTypeController.destroy");
}).prefix("/package-types");

Route.group(() => {
  Route.get("", "ZoneDeliveryController.index");
  Route.post("", "ZoneDeliveryController.store");
  Route.get("/:id", "ZoneDeliveryController.show");
  Route.put("/:id", "ZoneDeliveryController.update");
  Route.delete("/:id", "ZoneDeliveryController.destroy");
}).prefix("/zone-deliveries");

Route.group(() => {
  Route.get("", "ZoneDeliveryTypeController.index");
  Route.post("", "ZoneDeliveryTypeController.store");
  Route.get("/:id", "ZoneDeliveryTypeController.show");
  Route.put("/:id", "ZoneDeliveryTypeController.update");
  Route.delete("/:id", "ZoneDeliveryTypeController.destroy");
}).prefix("/zone-delivery-types");

Route.group(() => {
  Route.get("", "SellerNameController.index");
  Route.post("", "SellerNameController.store");
  Route.get("/:id", "SellerNameController.show");
  Route.put("/:id", "SellerNameController.update");
  Route.delete("/:id", "SellerNameController.destroy");
}).prefix("/seller-names");

Route.group(() => {
  Route.get("", "PaymentTypeController.index");
  Route.post("", "PaymentTypeController.store");
  Route.get("/:id", "PaymentTypeController.show");
  Route.put("/:id", "PaymentTypeController.update");
  Route.delete("/:id", "PaymentTypeController.destroy");
}).prefix("/payment-types");

Route.group(() => {
  Route.get("", "MenuTypeController.index");
  Route.post("", "MenuTypeController.store");
  Route.get("/:id", "MenuTypeController.show");
  Route.put("/:id", "MenuTypeController.update");
  Route.delete("/:id", "MenuTypeController.destroy");
}).prefix("/menu-types");

Route.group(() => {
  Route.get("/sync-data", "MealTypeController.syncData");

  Route.get("", "MealTypeController.index");
  Route.post("", "MealTypeController.store");
  Route.get("/:id", "MealTypeController.show");
  Route.put("/:id", "MealTypeController.update");
  Route.delete("/:id", "MealTypeController.destroy");
}).prefix("/meal-types");

Route.group(() => {
  Route.get("/sync-data", "MenuController.syncData");

  Route.get("", "MenuController.index");
  Route.post("", "MenuController.store");
  Route.get("/:id", "MenuController.show");
  Route.put("/:id", "MenuController.update");
  Route.delete("/:id", "MenuController.destroy");
}).prefix("/menus");

Route.group(() => {
  Route.get("/sync-data", "AdditionalTypeController.syncData");

  Route.get("", "AdditionalTypeController.index");
  Route.post("", "AdditionalTypeController.store");
  Route.get("/:id", "AdditionalTypeController.show");
  Route.put("/:id", "AdditionalTypeController.update");
  Route.delete("/:id", "AdditionalTypeController.destroy");
}).prefix("/additional-types");

Route.group(() => {
  Route.get("", "DeliveryRoundController.index");
  Route.post("", "DeliveryRoundController.store");
  Route.get("/:id", "DeliveryRoundController.show");
  Route.put("/:id", "DeliveryRoundController.update");
  Route.delete("/:id", "DeliveryRoundController.destroy");
}).prefix("/delivery-rounds");

Route.group(() => {
  Route.get("/sync-data", "ReceiveFoodController.syncData");

  Route.get("", "ReceiveFoodController.index");
  Route.post("", "ReceiveFoodController.store");
  Route.get("/:id", "ReceiveFoodController.show");
  Route.put("/:id", "ReceiveFoodController.update");
  Route.delete("/:id", "ReceiveFoodController.destroy");
}).prefix("/receive-foods");

Route.group(() => {
  Route.get("", "SelectFoodController.index");
  Route.post("", "SelectFoodController.store");
  Route.get("/:id", "SelectFoodController.show");
  Route.put("/:id", "SelectFoodController.update");
  Route.delete("/:id", "SelectFoodController.destroy");
}).prefix("/select-foods");

Route.group(() => {
  Route.get("/", "SetupMenuPhController.index");
  Route.post("/", "SetupMenuPhController.store");
  Route.put("/:id", "SetupMenuPhController.update");
  Route.delete("/:id", "SetupMenuPhController.destroy");

  Route.get(
    "get-menu-date/:date",
    "SetupMenuPhController.getDayOfWeekFromDate"
  );
  Route.get("/menus-by-day/:date", "SetupMenuPhController.getMenusByDay");
  Route.get("/menus-today", "SetupMenuPhController.getMenusByToDay");

  Route.post("set-start-date", "SetupMenuPhController.setStartDate");
  Route.get("get-start-date", async ({ response }) => {
    const controller = new (use(
      "App/Controllers/Http/SetupMenuPhController"
    ))();
    const startDate = await controller.getStartDate();
    return response.json({ startDate });
  });
}).prefix("setup-menu-ph");

Route.group(() => {
  Route.get("", "OrderPhController.index");
  Route.post("", "OrderPhController.store");
  // Route.get("/:id", "SelectFoodController.show");
  // Route.put("/:id", "SelectFoodController.update");
  // Route.delete("/:id", "SelectFoodController.destroy");
}).prefix("/order-ph");

Route.group(() => {
  Route.post('create-customer', 'CustomerController.create').middleware(['auth']) 
}).prefix('/customer')

Route.get("/seller-names-sync-data", "SellerNameController.syncData");
