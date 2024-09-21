// Made by rlarhsid. 24.09.21
// Play EZ2ON REBOOT: R! It's the best game I've ever played.

(function (thisObj) {
  function BoxMaker(thisObj) {
    var myPanel =
      thisObj instanceof Panel
        ? thisObj
        : new Window("palette", "BoxMaker", undefined, { resizeable: true });

    myPanel.minimumSize = [300, 150];
    myPanel.preferredSize = [300, 150];
    myPanel.alignChildren = ["left", "top"]; // Left align children

    var XInputGrp = myPanel.add("group", undefined, "X Length Group");
    XInputGrp.orientation = "row";
    XInputGrp.alignChildren = ["right", "center"]; // Align right
    XInputGrp.add("statictext", undefined, "X 너비: ").preferredSize = [70, 30];
    var XInput = XInputGrp.add("edittext", undefined, "0");
    XInput.preferredSize.width = 45;
    XInput.preferredSize.height = 30;

    var YInputGrp = myPanel.add("group", undefined, "Y Length Group");
    YInputGrp.orientation = "row";
    YInputGrp.alignChildren = ["right", "center"]; // Align right
    YInputGrp.add("statictext", undefined, "Y 너비: ").preferredSize = [70, 30];
    var YInput = YInputGrp.add("edittext", undefined, "0");
    YInput.preferredSize.width = 45;
    YInput.preferredSize.height = 30;

    var ZInputGrp = myPanel.add("group", undefined, "Z Length Group");
    ZInputGrp.orientation = "row";
    ZInputGrp.alignChildren = ["right", "center"]; // Align right
    ZInputGrp.add("statictext", undefined, "Z 너비: ").preferredSize = [70, 30];
    var ZInput = ZInputGrp.add("edittext", undefined, "0");
    ZInput.preferredSize.width = 45;
    ZInput.preferredSize.height = 25;

    var runButton = myPanel.add("button", undefined, "PlumSnack");
    runButton.alignChildren = ["center", "center"];
    runButton.preferredSize = [120, 40]; // Button size

    runButton.onClick = function () {
      var XLength = parseFloat(XInput.text);
      var YLength = parseFloat(YInput.text);
      var ZLength = parseFloat(ZInput.text);

      if (
        isNaN(XLength) ||
        XLength <= 0 ||
        isNaN(YLength) ||
        YLength <= 0 ||
        isNaN(ZLength) ||
        ZLength <= 0
      ) {
        alert("그런 숫자?");
        return;
      }

      var XHalfLength = XLength / 2;
      var YHalfLength = YLength / 2;
      var ZHalfLength = ZLength / 2;

      var comp = app.project.activeItem;
      if (!(comp instanceof CompItem)) {
        alert("컴포지션 선택도 안하는 그런 행동?");
        return;
      }

      app.beginUndoGroup("Create Box");

      var shapeLayers = [
        createShapeLayer(comp, "Layer A", [ZLength, YLength], [1, 0, 0]),
        createShapeLayer(comp, "Layer B", [ZLength, YLength], [1, 0, 0]),
        createShapeLayer(comp, "Layer C", [XLength, ZLength], [0, 0, 1]),
        createShapeLayer(comp, "Layer D", [XLength, ZLength], [0, 0, 1]),
        createShapeLayer(comp, "Layer E", [XLength, YLength], [0, 1, 0]),
        createShapeLayer(comp, "Layer F", [XLength, YLength], [0, 1, 0]),
      ];

      var nullLayer = comp.layers.addNull();
      nullLayer.name = "NULCTRL";
      nullLayer.label = 1;
      nullLayer.threeDLayer = true;

      for (var i = 0; i < shapeLayers.length; i++) {
        shapeLayers[i].parent = nullLayer;
      }

      shapeLayers[0]
        .property("ADBE Transform Group")
        .property("ADBE Position")
        .setValue([XHalfLength, 0, 0]);
      shapeLayers[0]
        .property("ADBE Transform Group")
        .property("ADBE Rotate Y")
        .setValue(90);

      shapeLayers[1]
        .property("ADBE Transform Group")
        .property("ADBE Position")
        .setValue([-XHalfLength, 0, 0]);
      shapeLayers[1]
        .property("ADBE Transform Group")
        .property("ADBE Rotate Y")
        .setValue(90);

      shapeLayers[2]
        .property("ADBE Transform Group")
        .property("ADBE Position")
        .setValue([0, YHalfLength, 0]);
      shapeLayers[2]
        .property("ADBE Transform Group")
        .property("ADBE Rotate X")
        .setValue(90);

      shapeLayers[3]
        .property("ADBE Transform Group")
        .property("ADBE Position")
        .setValue([0, -YHalfLength, 0]);
      shapeLayers[3]
        .property("ADBE Transform Group")
        .property("ADBE Rotate X")
        .setValue(90);

      shapeLayers[4]
        .property("ADBE Transform Group")
        .property("ADBE Position")
        .setValue([0, 0, ZHalfLength]);
      shapeLayers[5]
        .property("ADBE Transform Group")
        .property("ADBE Position")
        .setValue([0, 0, -ZHalfLength]);

      alert("펑!! (작업 끝나는 소리)");
      app.endUndoGroup();
    };

    if (myPanel instanceof Window) {
      myPanel.center();
      myPanel.show();
    } else {
      myPanel.layout.layout(true);
      myPanel.layout.resize();
    }

    function createShapeLayer(comp, name, size, color) {
      var shapeLayer = comp.layers.addShape();
      shapeLayer.name = name;

      var rectGroup = shapeLayer
        .property("ADBE Root Vectors Group")
        .addProperty("ADBE Vector Shape - Rect");
      rectGroup.property("ADBE Vector Rect Size").setValue(size);

      var fillGroup = shapeLayer
        .property("ADBE Root Vectors Group")
        .addProperty("ADBE Vector Graphic - Fill");
      fillGroup.property("ADBE Vector Fill Color").setValue(color);

      shapeLayer.threeDLayer = true;
      return shapeLayer;
    }
  }

  BoxMaker(thisObj);
})(this);
