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
const Helpers = use("Helpers");

Route.get('/', 'HomeController.index')
Route.post("/register", "AuthController.register");
Route.post("/login", "AuthController.login");
Route.post("/logout", "AuthController.logout").middleware(["auth"]);
Route.get("/profile", "AuthController.profile").middleware(["auth"]);
Route.put("/users/:id/role", "AuthController.updateRole").middleware("isAdmin");

Route.put("users/update-password", "AuthController.changePassword").middleware([
  "auth",
]);

Route.get("/users", "AuthController.index");
Route.delete("/users/:id", "UserController.destroy");
Route.put("/users/:id/role", "AuthController.updateRole");
// Route.post('/forgot-password', 'AuthController.forgotPassword')
// Route.post('/reset-password', 'AuthController.resetPassword')

Route.group(() => {
  Route.post("customer", "TestCustomerController.store");
  Route.get("/customer/profile", "TestCustomerController.show");

  Route.post("customer-hhb", "TestCustomerController.storeHHB");
  Route.get("/customer-hhb/profile", "TestCustomerController.showHHB");
}).middleware(["auth"]);

// Route.post("customer-hhb", "TestCustomerController.storeHHB");

Route.get(
  "check-user-registration",
  "TestCustomerController.checkUserRegistration"
).middleware(["auth"]);

Route.get(
  "check-user-registration-hhb",
  "TestCustomerController.checkUserRegistrationHHB"
).middleware(["auth"]);

// Route.get('/test-hash', async ({ response }) => {
//   const Hash = use('Hash')
//   const password = 'password123'

//   const hashedPassword = await Hash.make(password)
//   console.log('Hashed password:', hashedPassword)

//   return response.send({
//     message: 'Password hashed successfully',
//     hashedPassword
//   })
// })

Route.get("/sync-google-sheet", "CustomerController.syncData");
// Route.get("customers", "CustomerController.getCustomers");
// Route.get("customers/:id/address", "CustomerController.getCustomerAddress");
// Route.get("customers-hhb", "CustomerController.getCustomersHHB");

Route.group(() => {
  Route.get("", "CustomerController.index");
  Route.get("/:id", "CustomerController.show");
  Route.put("/:id", "CustomerController.update");
  Route.delete("/:id", "CustomerController.destroy");
}).prefix("/customers").middleware("isAdmin");

Route.group(() => {
  Route.get("", "CustomerHhbController.index");
  Route.get("/:id", "CustomerHhbController.show");
  Route.put("/:id", "CustomerHhbController.update");
  Route.delete("/:id", "CustomerHhbController.destroy");
  Route.put('/:id/delivery', 'CustomerHhbController.updateDelivery');
}).prefix("/customers-hhb").middleware("isAdmin");

Route.group(() => {
  Route.post("/", "SaleRecordAffController.store");
  Route.get("/", "SaleRecordAffController.index");
  Route.put("/:id", "SaleRecordAffController.update");
  Route.put(
    "/:id/payment-status",
    "SaleRecordAffController.updatePaymentStatus"
  );
  Route.delete("/:id", "SaleRecordAffController.deleteSaleRecord");
  Route.get("/user/:customer_id", "SaleRecordAffController.getSaleRecordsByCustomerId");
}).prefix("/sale-records").middleware("isAdmin");

Route.group(() => {
  Route.get("/daily", "SaleRecordAffController.getDailySales");
  Route.get("/all-daily", "SaleRecordAffController.getAllSales");
}).prefix("/sales").middleware("isAdmin");

Route.group(() => {
  Route.post("/", "SaleRecordHhbController.store");
  Route.get("/", "SaleRecordHhbController.index");
  Route.put("/:id", "SaleRecordHhbController.update");
  Route.put(
    "/:id/payment-status",
    "SaleRecordHhbController.updatePaymentStatus"
  );
  Route.delete("/:id", "SaleRecordHhbController.deleteSaleRecord");
  Route.get("/user/:customer_id", "SaleRecordHhbController.getSaleRecordsByCustomerId");
}).prefix("/sale-records-hhb").middleware("isAdmin");

Route.group(() => {
  Route.get("/daily", "SaleRecordHhbController.getDailySales");
  Route.get("/all-daily", "SaleRecordHhbController.getAllSales");
}).prefix("/sales-hhb").middleware("isAdmin");

Route.group(() => {
  Route.get("/", "PromotionTypeController.index");
  Route.post("/", "PromotionTypeController.store");
  Route.get("/:id", "PromotionTypeController.show");
  Route.put("/:id", "PromotionTypeController.update");
  Route.delete("/:id", "PromotionTypeController.destroy");
}).prefix("/promotion-types").middleware("isAdmin");

Route.group(() => {
  Route.get("/", "ProgramController.index");
  Route.post("/", "ProgramController.store");
  Route.get("/:id", "ProgramController.show");
  Route.put("/:id", "ProgramController.update");
  Route.delete("/:id", "ProgramController.destroy");
}).prefix("/programs").middleware("isAdmin");

Route.group(() => {
  Route.get("/", "PackageController.index");
  Route.post("/", "PackageController.store");
  Route.get("/:id", "PackageController.show");
  Route.put("/:id", "PackageController.update");
  Route.delete("/:id", "PackageController.destroy");
  Route.get("/sync-data", "PackageController.syncData");
}).prefix("/packages").middleware("isAdmin");

Route.group(() => {
  Route.get("", "PackageTypeController.index");
  Route.post("", "PackageTypeController.store");
  Route.get("/:id", "PackageTypeController.show");
  Route.put("/:id", "PackageTypeController.update");
  Route.delete("/:id", "PackageTypeController.destroy");
}).prefix("/package-types").middleware("isAdmin");

Route.group(() => {
  Route.get("", "ZoneDeliveryController.index");
  Route.post("", "ZoneDeliveryController.store");
  Route.get("/:id", "ZoneDeliveryController.show");
  Route.put("/:id", "ZoneDeliveryController.update");
  Route.delete("/:id", "ZoneDeliveryController.destroy");
}).prefix("/zone-deliveries").middleware("isAdmin");

Route.group(() => {
  Route.get("", "ZoneDeliveryTypeController.index");
  Route.post("", "ZoneDeliveryTypeController.store");
  Route.get("/:id", "ZoneDeliveryTypeController.show");
  Route.put("/:id", "ZoneDeliveryTypeController.update");
  Route.delete("/:id", "ZoneDeliveryTypeController.destroy");
}).prefix("/zone-delivery-types").middleware("isAdmin");

Route.group(() => {
  Route.get("", "SellerNameController.index");
  Route.post("", "SellerNameController.store");
  Route.get("/:id", "SellerNameController.show");
  Route.put("/:id", "SellerNameController.update");
  Route.delete("/:id", "SellerNameController.destroy");
}).prefix("/seller-names").middleware("isAdmin");

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
}).prefix("/menu-types").middleware("isAdmin");

Route.group(() => {
  Route.get("/sync-data", "MealTypeController.syncData");

  Route.get("", "MealTypeController.index");
  Route.post("", "MealTypeController.store");
  Route.get("/:id", "MealTypeController.show");
  Route.put("/:id", "MealTypeController.update");
  Route.delete("/:id", "MealTypeController.destroy");
}).prefix("/meal-types").middleware("isAdmin");

Route.group(() => {
  Route.get("/sync-data", "MenuController.syncData");

  Route.get("", "MenuController.index");
  Route.post("", "MenuController.store");
  Route.get("/:id", "MenuController.show");
  Route.put("/:id", "MenuController.update");
  Route.delete("/:id", "MenuController.destroy");

  Route.get("/uploads/*", async ({ response, params }) => {
    return response.download(Application.tmpPath("uploads", params[0]));
  });
}).prefix("/menus").middleware("isAdmin");

Route.group(() => {
  Route.get("/sync-data", "AdditionalTypeController.syncData");

  Route.get("", "AdditionalTypeController.index");
  Route.post("", "AdditionalTypeController.store");
  Route.get("/:id", "AdditionalTypeController.show");
  Route.put("/:id", "AdditionalTypeController.update");
  Route.delete("/:id", "AdditionalTypeController.destroy");
}).prefix("/additional-types").middleware("isAdmin");

Route.group(() => {
  Route.get("", "DeliveryRoundController.index");
  Route.post("", "DeliveryRoundController.store");
  Route.get("/:id", "DeliveryRoundController.show");
  Route.put("/:id", "DeliveryRoundController.update");
  Route.delete("/:id", "DeliveryRoundController.destroy");
}).prefix("/delivery-rounds").middleware("isAdmin");

Route.group(() => {
  Route.get("/sync-data", "ReceiveFoodController.syncData");

  Route.get("", "ReceiveFoodController.index");
  Route.post("", "ReceiveFoodController.store");
  Route.get("/:id", "ReceiveFoodController.show");
  Route.put("/:id", "ReceiveFoodController.update");
  Route.delete("/:id", "ReceiveFoodController.destroy");
}).prefix("/receive-foods").middleware("isAdmin");

Route.group(() => {
  Route.get("", "SelectFoodController.index");
  Route.post("", "SelectFoodController.store");
  Route.get("/:id", "SelectFoodController.show");
  Route.put("/:id", "SelectFoodController.update");
  Route.delete("/:id", "SelectFoodController.destroy");
}).prefix("/select-foods").middleware("isAdmin");

Route.group(() => {
  Route.get("/", "SetupMenuPhController.index");
  Route.post("/", "SetupMenuPhController.store").middleware("isAdmin");
  Route.put("/:id", "SetupMenuPhController.update").middleware("isAdmin");
  Route.delete("/:id", "SetupMenuPhController.destroy").middleware("isAdmin");

  Route.get(
    "get-menu-date/:date",
    "SetupMenuPhController.getDayOfWeekFromDate"
  );
  Route.get("/menus-by-day/:date", "SetupMenuPhController.getMenusByDay");
  Route.get("/menus-today", "SetupMenuPhController.getMenusByToDay");

  Route.post("set-start-date", "SetupMenuPhController.setStartDate").middleware(
    "isAdmin"
  );
  Route.get("get-start-date", async ({ response }) => {
    const controller = new (use(
      "App/Controllers/Http/SetupMenuPhController"
    ))();
    const startDate = await controller.getStartDate();
    return response.json({ startDate });
  });
}).prefix("setup-menu-ph");

Route.group(() => {
  Route.get("/", "SetupMenuHhbController.index");
  Route.post("/", "SetupMenuHhbController.store").middleware("isAdmin");
  Route.put("/:id", "SetupMenuHhbController.update").middleware("isAdmin");
  Route.delete("/:id", "SetupMenuHhbController.destroy").middleware("isAdmin");

  Route.get(
    "get-menu-date/:date",
    "SetupMenuHhbController.getDayOfWeekFromDate"
  );
  Route.get("/menus-by-day/:date", "SetupMenuHhbController.getMenusByDay");
  Route.get("/menus-today", "SetupMenuHhbController.getMenusByToDay");

  Route.post("set-start-date", "SetupMenuHhbController.setStartDate").middleware("isAdmin");
  Route.get("get-start-date", async ({ response }) => {
    const controller = new (use(
      "App/Controllers/Http/SetupMenuHhbController"
    ))();
    const startDate = await controller.getStartDate();
    return response.json({ startDate });
  });
}).prefix("setup-menu-hhb");

Route.group(() => {
  Route.get("/", "SetupMenuLcController.index");
  Route.post("/", "SetupMenuLcController.store").middleware("isAdmin");
  Route.put("/:id", "SetupMenuLcController.update").middleware("isAdmin");
  Route.delete("/:id", "SetupMenuLcController.destroy").middleware("isAdmin");

  Route.get(
    "get-menu-date/:date",
    "SetupMenuLcController.getDayOfWeekFromDate"
  );
  Route.get("/menus-by-day/:date", "SetupMenuLcController.getMenusByDay");
  Route.get("/menus-today", "SetupMenuLcController.getMenusByToDay");

  Route.post("set-start-date", "SetupMenuLcController.setStartDate").middleware("isAdmin");
  Route.get("get-start-date", async ({ response }) => {
    const controller = new (use(
      "App/Controllers/Http/SetupMenuLcController"
    ))();
    const startDate = await controller.getStartDate();
    return response.json({ startDate });
  });
}).prefix("setup-menu-lc");

Route.group(() => {
  Route.get("/", "SetupMenuFlController.index");
  Route.post("/", "SetupMenuFlController.store").middleware("isAdmin");
  Route.put("/:id", "SetupMenuFlController.update").middleware("isAdmin");
  Route.delete("/:id", "SetupMenuFlController.destroy").middleware("isAdmin");

  Route.get(
    "get-menu-date/:date",
    "SetupMenuFlController.getDayOfWeekFromDate"
  );
  Route.get("/menus-by-day/:date", "SetupMenuFlController.getMenusByDay");
  Route.get("/menus-today", "SetupMenuFlController.getMenusByToDay");

  Route.post("set-start-date", "SetupMenuFlController.setStartDate").middleware("isAdmin");
  Route.get("get-start-date", async ({ response }) => {
    const controller = new (use(
      "App/Controllers/Http/SetupMenuFlController"
    ))();
    const startDate = await controller.getStartDate();
    return response.json({ startDate });
  });
}).prefix("setup-menu-fl");

Route.group(() => {
  Route.get("/", "SetupMenuBpdController.index");
  Route.post("/", "SetupMenuBpdController.store").middleware("isAdmin");
  Route.put("/:id", "SetupMenuBpdController.update").middleware("isAdmin");
  Route.delete("/:id", "SetupMenuBpdController.destroy").middleware("isAdmin");

  Route.get(
    "get-menu-date/:date",
    "SetupMenuBpdController.getDayOfWeekFromDate"
  );
  Route.get("/menus-by-day/:date", "SetupMenuBpdController.getMenusByDay");
  Route.get("/menus-today", "SetupMenuBpdController.getMenusByToDay");

  Route.post("set-start-date", "SetupMenuBpdController.setStartDate").middleware("isAdmin");
  Route.get("get-start-date", async ({ response }) => {
    const controller = new (use(
      "App/Controllers/Http/SetupMenuBpdController"
    ))();
    const startDate = await controller.getStartDate();
    return response.json({ startDate });
  });
}).prefix("setup-menu-bpd");

Route.group(() => {
  Route.get("/", "SetupMenuDiseaseController.index");
  Route.post("/", "SetupMenuDiseaseController.store").middleware("isAdmin");
  Route.put("/:id", "SetupMenuDiseaseController.update").middleware("isAdmin");
  Route.delete("/:id", "SetupMenuDiseaseController.destroy").middleware("isAdmin");

  Route.get(
    "get-menu-date/:date",
    "SetupMenuDiseaseController.getDayOfWeekFromDate"
  );
  Route.get("/menus-by-day/:date", "SetupMenuDiseaseController.getMenusByDay");
  Route.get("/menus-today", "SetupMenuDiseaseController.getMenusByToDay");

  Route.post("set-start-date", "SetupMenuDiseaseController.setStartDate").middleware("isAdmin");
  Route.get("get-start-date", async ({ response }) => {
    const controller = new (use(
      "App/Controllers/Http/SetupMenuDiseaseController"
    ))();
    const startDate = await controller.getStartDate();
    return response.json({ startDate });
  });
}).prefix("setup-menu-fat-disease");

Route.group(() => {
  Route.get("/", "SetupMenuDiabeteController.index");
  Route.post("/", "SetupMenuDiabeteController.store").middleware("isAdmin");
  Route.put("/:id", "SetupMenuDiabeteController.update").middleware("isAdmin");
  Route.delete("/:id", "SetupMenuDiabeteController.destroy").middleware("isAdmin");

  Route.get(
    "get-menu-date/:date",
    "SetupMenuDiabeteController.getDayOfWeekFromDate"
  );
  Route.get("/menus-by-day/:date", "SetupMenuDiabeteController.getMenusByDay");
  Route.get("/menus-today", "SetupMenuDiabeteController.getMenusByToDay");

  Route.post("set-start-date", "SetupMenuDiabeteController.setStartDate").middleware("isAdmin");
  Route.get("get-start-date", async ({ response }) => {
    const controller = new (use(
      "App/Controllers/Http/SetupMenuDiabeteController"
    ))();
    const startDate = await controller.getStartDate();
    return response.json({ startDate });
  });
}).prefix("setup-menu-diabete");

Route.group(() => {
  Route.get("", "OrderController.index");
  Route.post("", "OrderController.store");
    // Route.get("/:id", "SelectFoodController.show");
  // Route.put("/:id", "SelectFoodController.update");
  // Route.delete("/:id", "SelectFoodController.destroy");
})
  .prefix("/order")
  .middleware(["auth"]);

Route.group(() => {
  Route.get("", "OrderHhbController.index");
  Route.post("", "OrderHhbController.store");
  // Route.get("/:id", "SelectFoodController.show");
  // Route.put("/:id", "SelectFoodController.update");
  // Route.delete("/:id", "SelectFoodController.destroy");
})
  .prefix("/order-hhb")
  .middleware(["auth"]);

Route.group(() => {
  Route.post("create-customer", "CustomerController.create").middleware([
    "auth",
  ]);
}).prefix("/customer");

Route.get("/orders/date-range", "OrderController.getOrdersByDateRange").middleware("isAdmin");
Route.get("/orders/user/:customer_id", "OrderController.getOrdersByCustomerId").middleware("isAdmin");
Route.get('/orders', 'OrderController.getOrdersByDate').middleware("isAdmin");
Route.put('/orders/:id', 'OrderController.updateQuantity').middleware("isAdmin");
Route.delete('/orders/:id', 'OrderController.destroy').middleware("isAdmin");
Route.post("/orders-add", "OrderController.storeAdd").middleware("isAdmin");

Route.put("/order/:id/status", "OrderController.updateStatus").middleware("isAdmin");
Route.post("/order/update-status", "OrderController.updateMultipleStatus").middleware("isAdmin");

Route.get("/orders-hhb/date-range", "OrderHhbController.getOrdersByDateRange").middleware("isAdmin");
Route.get("/orders-hhb/user/:customer_id", "OrderHhbController.getOrdersByCustomerId").middleware("isAdmin");
Route.put('/orders-hhb/:id', 'OrderHhbController.updateQuantity').middleware("isAdmin");
Route.delete('/orders-hhb/:id', 'OrderHhbController.destroy').middleware("isAdmin");
Route.post("/orders-hhb-add", "OrderHhbController.storeAdd").middleware("isAdmin");

Route.put("/order-hhb/:id/status", "OrderHhbController.updateStatus").middleware("isAdmin");
Route.post("/order-hhb/update-status", "OrderHhbController.updateMultipleStatus").middleware("isAdmin");

Route.get("/seller-names-sync-data", "SellerNameController.syncData").middleware("isAdmin");

Route.group(() => {
  Route.get("/orders", "OrderController.getOrdersByUserId").middleware(["auth"]);
})

Route.group(() => {
  Route.get("/orders-hhb", "OrderHhbController.getOrdersByUserId").middleware(["auth"]);
})

Route.group(() => {
  Route.get("/sale-records-user", "SaleRecordAffController.getSaleRecordsByUserId").middleware(["auth"]);
})
Route.group(() => {
  Route.get("/sale-records-hhb-user", "SaleRecordHhbController.getSaleRecordsByUserId").middleware(["auth"]);
})