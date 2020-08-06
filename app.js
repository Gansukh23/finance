// дэлгэцтэй ажиллах контроллер
var uiController = (function () {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
    incomeList: ".income__list",
    expenseList: ".expenses__list",
    tusuvLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    containerDiv: ".container",
    expensePercentageLabel: ".item__percentage",
    dateLabel: ".budget__title--month",
  };

  var nomeListForeach = function (list, callback) {
    for (var i = 0; i < list.length; i++) callback(list[i], i);
  };

  var formatMoney = function (too, type) {
    too = "" + too;
    var x = too.split("").reverse().join("");
    y = "";
    var count = 1;
    for (var i = 0; i < x.length; i++) {
      y = y + x[i];
      if (count % 3 === 0) y = y + ",";
      count++;
    }
    var z = y.split("").reverse().join("");
    if (z[0] === ",") z = z.substr(1, z.length - 1);
    if (type === "inc") z = "+ " + z;
    else z = "- " + z;
    return z;
  };
  return {
    displayDate: function () {
      var unuudur = new Date();

      document.querySelector(DOMstrings.dateLabel).textContent =
        unuudur.getFullYear() + " оны " + unuudur.getMonth();
    },

    changeType: function () {
      var fields = document.querySelectorAll(
        DOMstrings.inputType +
          ", " +
          DOMstrings.inputDescription +
          ", " +
          DOMstrings.inputValue
      );
      nomeListForeach(fields, function (el) {
        el.classList.toggle("red-focus");
      });
      document.querySelector(DOMstrings.addBtn).classList.toggle("red");
    },

    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseInt(document.querySelector(DOMstrings.inputValue).value),
      };
    },

    displayPercentages: function (allPercentages) {
      var elments = document.querySelectorAll(
        DOMstrings.expensePercentageLabel
      );
      nomeListForeach(elments, function (el, index) {
        el.textContent = allPercentages[index] + "%";
      });
    },
    getDOMstrings: function () {
      return DOMstrings;
    },
    clearFields: function () {
      var fields = document.querySelectorAll(
        DOMstrings.inputDescription + ", " + DOMstrings.inputValue
      );

      // Convert List to Arr
      var fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function (el) {
        el.value = "";
      });
      // курсор тохируулах
      fieldsArr[0].focus();
      // for (var i = 0; i < fieldsArr.length; i++) {
      //   fieldsArr[i].value = "";
      // }
    },

    tusviigUzuuleh: function (tusuv) {
      var type;
      if (tusuv.tusuv >= 0) type = "inc";
      else type = "exp";
      document.querySelector(DOMstrings.tusuvLabel).textContent = formatMoney(
        tusuv.tusuv,
        type
      );
      document.querySelector(DOMstrings.incomeLabel).textContent = formatMoney(
        tusuv.totalInc,
        "inc"
      );
      document.querySelector(DOMstrings.expenseLabel).textContent = formatMoney(
        tusuv.totalExp,
        "exp"
      );
      document.querySelector(DOMstrings.percentageLabel).textContent =
        tusuv.huvi + "%";
    },

    deleteListItem: function (id) {
      var el = document.getElementById(id);
      el.parentNode.removeChild(el);
    },

    addListItem: function (item, type) {
      //Орлого зарлагын элементийг агуулсан html-ийг бэлтгэнэ.
      var html, list;
      if (type === "inc") {
        list = DOMstrings.incomeList;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%DES%</div><div class="right clearfix"><div class="item__value">%VAL%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else {
        list = DOMstrings.expenseList;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%DES%</div><div class="right clearfix"><div class="item__value">%VAL%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      // Тэр бэлтгэсэн html дотроо орлого зарлагын утгуудыг REPLACE ашиглаж хийж өгнө
      var html = html.replace("%id%", item.id);
      var html = html.replace("%DES%", item.description);
      var html = html.replace("%VAL%", formatMoney(item.value, type));
      // Бэлтгэсэн html ээ DOM руу хийж өгнө\
      document.querySelector(list).insertAdjacentHTML("beforeend", html);
    },
  };
})();

// Санхүүтэй ажиллах контроллер
var finaceController = (function () {
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else this.percentage = 0;
  };
  Expense.prototype.getPercentage = function () {
    return this.percentage;
  };

  var calculateTotal = function (type) {
    var sum = 0;
    data.items[type].forEach(function (el) {
      sum = sum + el.value;
    });
    data.totals[type] = sum;
  };
  var data = {
    items: {
      inc: [],
      exp: [],
    },
    totals: {
      inc: 0,
      exp: 0,
    },
    tusuv: 0,
    huvi: 0,
  };

  return {
    tusuvTootsooloh: function () {
      // нийт орлого
      calculateTotal("inc");

      //нийт зарлага
      calculateTotal("exp");

      //нийт төсөв
      data.tusuv = data.totals.inc - data.totals.exp;

      // зарлагийн хувь
      if (data.totals.inc > 0)
        data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
      else data.huvi = 0;
    },
    tusuvAvah: function () {
      return {
        tusuv: data.tusuv,
        huvi: data.huvi,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
      };
    },
    deleteItem: function (type, id) {
      var ids = data.items[type].map(function (el) {
        return el.id;
      });
      var index = ids.indexOf(id);
      if (index !== -1) {
        data.items[type].splice(index, 1);
      }
    },
    addItem: function (type, desc, val) {
      var item,
        id = 1;

      //id

      if (data.items[type].length === 0) id = 1;
      else {
        id = data.items[type][data.items[type].length - 1].id + 1;
      }
      if (type === "inc") {
        item = new Income(id, desc, val);
      } else {
        item = new Expense(id, desc, val);
      }
      data.items[type].push(item);

      return item;
    },
    calculatePercentages: function () {
      data.items.exp.forEach(function (el) {
        el.calcPercentage(data.totals.inc);
      });
    },
    getPercentage: function () {
      var allPercentage = data.items.exp.map(function (el) {
        return el.percentage;
      });
      return allPercentage;
    },
  };
})();

// Програмын холбогч контроллер
var appController = (function (uiController, fnController) {
  var ctrlAddItem = function () {
    // 1.оруулах өгөгдөлийг олж авна
    var input = uiController.getInput();
    if (input.description !== "" && input.value > 0) {
      // 2.олж авсан өгөгдөлөө санхүүгийн контролд хадгална
      var item = finaceController.addItem(
        input.type,
        input.description,
        input.value
      );
      // 3.олж авсан өгөгдөлөө тохирох газар байрлуулна.add
      uiController.addListItem(item, input.type);
      uiController.clearFields();
      updateTusuv();
    }
  };

  var updateTusuv = function () {
    // 4.Төсвийг тооцно
    finaceController.tusuvTootsooloh();

    // 5.эцсийн үлдэгдэлийг тооцно.
    var tusuv = finaceController.tusuvAvah();
    //6. Төсвийн тооцоог дэлгэцэнд гаргах
    //console.log(tusuv);
    uiController.tusviigUzuuleh(tusuv);
    //7. элементүүдийн хувийг тооцоолно.
    finaceController.calculatePercentages();
    //8. элементүүдийн хувийг хүлээж авна
    var allPercentage = finaceController.getPercentage();
    //9. эдгээрийн хувийг дэлгэцэнд гаргана
    uiController.displayPercentages(allPercentage);
  };
  var setupEventLIsteners = function () {
    var DOM = uiController.getDOMstrings();

    document.querySelector(DOM.addBtn).addEventListener("click", function () {
      ctrlAddItem();
    });

    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document
      .querySelector(DOM.inputType)
      .addEventListener("change", uiController.changeType);

    document
      .querySelector(DOM.containerDiv)
      .addEventListener("click", function (event) {
        var id = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (id) {
          //inc-2
          var arr = id.split("-");
          var type = arr[0];
          var itemId = parseInt(arr[1]);
          //1. Санхүүгийн модуулаас датагаа устгана
          finaceController.deleteItem(type, itemId);
          //2. Дэлгэц дээр устгана
          uiController.deleteListItem(id);
          //3. Үлдэгдэл тооцоог дахин хийнэ.
          updateTusuv();
        }
      });
  };

  return {
    init: function () {
      uiController.displayDate();
      uiController.tusviigUzuuleh({
        tusuv: 0,
        huvi: 0,
        totalInc: 0,
        totalExp: 0,
      });
      setupEventLIsteners();
    },
  };
})(uiController, finaceController);

appController.init();
