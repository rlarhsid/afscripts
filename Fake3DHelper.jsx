// Made by rlarhsid. 24.09.21
// Why are you reading this? Go back, just use the script.

function createUI(thisObj) {
  var win =
    thisObj instanceof Panel
      ? thisObj
      : new Window("palette", "Fake3DHelper", undefined);

  win.minimumSize = [300, 150];
  win.preferredSize = [300, 150];

  win.orientation = "column";
  win.alignChildren = ["center", "top"]; // Center align children

  var inputGroup1 = win.add("group", undefined, "Input Group 1");
  inputGroup1.orientation = "row";
  inputGroup1.alignChildren = ["right", "center"]; // Align right
  inputGroup1.add("statictext", undefined, "정수 입력: ").preferredSize = [
    100, 30,
  ];
  var inputText = inputGroup1.add("edittext", undefined, "0");
  inputText.characters = 4;
  inputText.preferredSize = [50, 30];

  var inputGroup2 = win.add("group", undefined, "Input Group 2");
  inputGroup2.orientation = "row";
  inputGroup2.alignChildren = ["right", "center"]; // Align right
  inputGroup2.add("statictext", undefined, "Z값 변화량: ").preferredSize = [
    100, 30,
  ];
  var zChangeText = inputGroup2.add("edittext", undefined, "0");
  zChangeText.characters = 4;
  zChangeText.preferredSize = [50, 30];

  var buttonGroup = win.add("group", undefined, "Button Group");
  buttonGroup.orientation = "row";
  buttonGroup.alignChildren = ["center", "center"]; // Center align button
  var duplicateButton = buttonGroup.add("button", undefined, "PlumSnack");
  duplicateButton.preferredSize = [120, 40];

  duplicateButton.onClick = function () {
    var numCopies = parseInt(inputText.text);
    var zChange = parseFloat(zChangeText.text);

    if (isNaN(numCopies) || numCopies <= 0) {
      alert("그런 숫자?");
      return;
    }

    var comp = app.project.activeItem;
    if (comp instanceof CompItem && comp.selectedLayers.length > 0) {
      var originalLayer = comp.selectedLayers[0];
      var duplicatedLayers = [];

      app.beginUndoGroup("Duplicate and Offset Z Position");

      if (!originalLayer.threeDLayer) {
        originalLayer.threeDLayer = true;
      }

      duplicatedLayers.push(originalLayer);

      for (var i = 1; i <= numCopies; i++) {
        var newLayer = originalLayer.duplicate();
        var newPos = newLayer.property("Position").value;
        newPos[2] += zChange * i;
        newLayer.property("Position").setValue(newPos);
        duplicatedLayers.push(newLayer);
      }

      var nullLayer = comp.layers.addNull();
      nullLayer.name = "NULCTRL";
      nullLayer.threeDLayer = true;
      nullLayer.label = 5;

      for (var j = 0; j < duplicatedLayers.length; j++) {
        duplicatedLayers[j].parent = nullLayer;
        duplicatedLayers[j].shy = true;
      }
      originalLayer.shy = true;

      app.endUndoGroup();
      alert("펑!! × " + numCopies + " (레이어 복제되는 소리) ");
    } else {
      alert("레이어 선택도 안하는 그런 행동?");
    }
  };

  var footer = win.add("statictext", undefined, "rlarhsid / 2024.09.21");
  footer.alignment = "center";
  footer.graphics.font = ScriptUI.newFont("Arial", "italic", 10);

  if (win instanceof Window) {
    win.center();
    win.show();
  } else {
    win.layout.layout(true);
  }
}

createUI(this);
