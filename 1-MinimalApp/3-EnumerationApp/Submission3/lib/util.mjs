
function isNonEmptyString(x) {
  return typeof(x) === "string" && x.trim() !== "";
}

function nextReleaseDate() {
  var date = new Date();
  return (date.getFullReleaseDate() + 1);
}

function isIntegerOrIntegerString(x) {
  return typeof(x) === "number" && Number.isInteger(x) ||
      typeof(x) === "string" && x.search(/^-?[0-9]+$/) === 0;
}

function cloneObject(obj) {
  var p="", val,
      clone = Object.create( Object.getPrototypeOf(obj));
  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      val = obj[p];
      if (typeof val === "number" ||
          typeof val === "string" ||
          typeof val === "boolean" ||
          val instanceof Date ||
          // typed object reference
          typeof val === "object" && !!val.constructor ||
          // list of data values
          Array.isArray( val) &&
          !val.some( function (el) {
            return typeof el === "object";
          }) ||
          // list of typed object references
          Array.isArray( val) &&
          val.every( function (el) {
            return (typeof el === "object" && !!el.constructor);
          })
      ) {
        if (Array.isArray( val)) clone[p] = val.slice(0);
        else clone[p] = val;
      }
      // else clone[p] = cloneObject(val);
    }
  }
  return clone;
}

function fillSelectWithOptions( selectEl, selectionRange, optPar) {
  // create option elements from object property values
  const options = Array.isArray( selectionRange) ? selectionRange :
      Object.keys( selectionRange);
  // delete old contents
  selectEl.innerHTML = "";
  // create "no selection yet" entry
  if (!selectEl.multiple) {
    selectEl.add( createOption(""," --- "));
  }
  for (const i of options.keys()) {
    let optionEl=null;
    if (Array.isArray( selectionRange)) {
      optionEl = createOption( i+1, options[i]);
      if (selectEl.multiple && optPar && optPar.selection &&
          optPar.selection.includes(i+1)) {
        // flag the option element with this value as selected
        optionEl.selected = true;
      }
    } else {
      const key = options[i];
      const obj = selectionRange[key];
      if (optPar && optPar.displayProp) {
        optionEl = createOption( key, obj[optPar.displayProp]);
      } else optionEl = createOption( key);
      // if invoked with a selection argument, flag the selected options
      if (selectEl.multiple && optPar && optPar.selection &&
          optPar.selection[key]) {
        // flag the option element with this value as selected
        optionEl.selected = true;
      }
    }
    selectEl.add( optionEl);
  }
}

function createOption( val, txt, classValues) {
  var el = document.createElement("option");
  el.value = val;
  el.text = txt || val;
  if (classValues) el.className = classValues;
  return el;
}

function createLabeledChoiceControl( t,n,v,lbl) {
  var ccEl = document.createElement("input"),
      lblEl = document.createElement("label");
  ccEl.type = t;
  ccEl.name = n;
  ccEl.value = v;
  lblEl.appendChild( ccEl);
  lblEl.appendChild( document.createTextNode( lbl));
  return lblEl;
}
function createChoiceWidget( containerEl, fld, values,
                             choiceWidgetType, choiceItems, isMandatory) {
  const choiceControls = containerEl.querySelectorAll("label");
  // remove old content
  for (const j of choiceControls.keys()) {
    containerEl.removeChild( choiceControls[j]);
  }
  if (!containerEl.hasAttribute("data-bind")) {
    containerEl.setAttribute("data-bind", fld);
  }
  // for a mandatory radio button group initialze to first value
  if (choiceWidgetType === "radio" && isMandatory && values.length === 0) {
    values[0] = 1;
  }
  if (values.length >= 1) {
    if (choiceWidgetType === "radio") {
      containerEl.setAttribute("data-value", values[0]);
    } else {  // checkboxes
      containerEl.setAttribute("data-value", "["+ values.join() +"]");
    }
  }
  for (const j of choiceItems.keys()) {
    // button values = 1..n
    const el = createLabeledChoiceControl( choiceWidgetType, fld,
        j+1, choiceItems[j]);
    // mark the radio button or checkbox as selected/checked
    if (values.includes(j+1)) el.firstElementChild.checked = true;
    containerEl.appendChild( el);
    el.firstElementChild.addEventListener("click", function (e) {
      const btnEl = e.target;
      if (choiceWidgetType === "radio") {
        if (containerEl.getAttribute("data-value") !== btnEl.value) {
          containerEl.setAttribute("data-value", btnEl.value);
        } else if (!isMandatory) {
          // turn off radio button
          btnEl.checked = false;
          containerEl.setAttribute("data-value", "");
        }
      } else {  // checkbox
        let values = JSON.parse( containerEl.getAttribute("data-value")) || [];
        let i = values.indexOf( parseInt( btnEl.value));
        if (i > -1) {
          values.splice(i, 1);  // delete from value list
        } else {  // add to value list
          values.push( btnEl.value);
        }
        containerEl.setAttribute("data-value", "["+ values.join() +"]");
      }
    });
  }
  return containerEl;
}

export { isNonEmptyString, isIntegerOrIntegerString, cloneObject, createOption,
  fillSelectWithOptions, createChoiceWidget };