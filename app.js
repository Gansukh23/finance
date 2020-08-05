// дэлгэцтэй ажиллах контроллер
var uiController = (function () {})();
// Санхүүтэй ажиллах контроллер
var finaceController = (function () {})();
// Програмын холбогч контроллер
var appController = (function (uiController, fnController) {
  var ctrlAddItem = function () {
    console.log("Өгөгдөл авлаа");
    // 1.оруулах өгөгдөлийг олж авна
    // 2.олж авсан өгөгдөлөө санхүүгийн контролд хадгална
    // 3.олж авсан өгөгдөлөө тохирох газар байрлуулна.add
    // 4.Төсвийг тооцно
    // 5.эцсийн үлдэгдэлийг тооцно.
  };
  document.querySelector(".add__btn").addEventListener("click", function () {
    ctrlAddItem();
  });

  document.addEventListener("keypress", function (event) {
    if (event.keyCode === 13 || event.which === 13) ctrlAddItem();
  });
})(uiController, finaceController);
