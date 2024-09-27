export class Dropdown {
    element = null;
    parentElement = null;
    listItemsArr = [];

    constructor(element, parent, { listItemsArr } = {}) {
        this.element = $(element);
        this.parentElement = $(parent);
        this.parentElement.append(this.element);

        this.listItemsArr = listItemsArr;
    }

    addButton(btnElement) {
        this.element.append(btnElement);
        return this;
    }

    addDropdownMenu(menuElement, cb) {
        this.element.append(menuElement);
        cb.call(this, this.listItemsArr);
        return this;
    }

    initDropdownEvents(cb) {
        cb.call(this);
        return this;
    }
}
