import React, { useState } from 'react';
// import logo from './logo.svg';
import './App.css';

/**
 * Sorry I've changed the components to functions to use hooks. Hope you don't mind.
 * I can definitely do class components also though. Just trying to save a bit of code.
 */

const selectedItemsTypes = {
  ALL_COMPLETE: 1,
  ALL_INCOMPLETE: 2,
  MIXED: 3,
}

/**
 * Move the function out of the componet to avoid its being re-compiled 
 * by the js runtime every time when the function component is called.
 * 
 * Same in below.
 */
function getSelectedItemsTypeFilter() {
  let completeCount = 0;
  let incompleteCount = 0;
  const filterItem = (item) => {
    if (item.isSelected) {
      item.complete ? completeCount++ : incompleteCount++;
    }
  }

  const getType = () => {
    if (completeCount === 0 && incompleteCount > 0) {
      return selectedItemsTypes.ALL_INCOMPLETE;
    }
    if (incompleteCount === 0 && completeCount > 0) {
      return selectedItemsTypes.ALL_COMPLETE;
    }
    return selectedItemsTypes.MIXED;
  }

  return {
    filterItem,
    getType,
  }
}

function getItemsOnSelectToggle(items, index) {
  let newItems = [];
  let hasSelectedItems = false;
  const {filterItem, getType} = getSelectedItemsTypeFilter();
  newItems = items.map((item, i) => {
    let _item = {...item};
    if (index === i) {
      _item.isSelected = !item.isSelected;
    }
    if (_item.isSelected && !hasSelectedItems) {
      hasSelectedItems = true;
    }
    filterItem(_item);
    return _item;
  });
  return [newItems, hasSelectedItems, getType()];
}

function getItemsOnToggle(items, index) {
  let newItems = [];
  const {filterItem, getType} = getSelectedItemsTypeFilter();
  newItems = items.map((item, i) => {
    let _item = {...item};
    if (index === i) {
      _item.complete = !item.complete;
    }
    filterItem(_item);
    return _item;
  });
  return [newItems, getType()];
}

function getItemsOnBulkCompleteToggle(items, complete = true) {
  let newItems = [];
  const {filterItem, getType} = getSelectedItemsTypeFilter();
  newItems = items.map((item) => {
    let _item = {...item};
    if (item.isSelected) {
      _item.complete = complete;
    }
    filterItem(_item);
    return _item;
  });
  return [newItems, getType()];
}

function BottomMenu({
  isOpen = false,
  selectedItemsType = selectedItemsTypes.MIXED,
  onBulkComplete = () => {}, 
  onBulkIncomplete = () => {}}
) {
  return (
    <div className={`bottom-menu ${isOpen ? 'visible' : ''}`}>
      {(selectedItemsType === selectedItemsTypes.MIXED || selectedItemsType === selectedItemsTypes.ALL_INCOMPLETE) && (
        <button onClick={onBulkComplete}>Mark as complete</button>
      )}
      {(selectedItemsType === selectedItemsTypes.MIXED || selectedItemsType === selectedItemsTypes.ALL_COMPLETE) && (
        <button onClick={onBulkIncomplete}>Mark as incomplete</button>
      )}
    </div>
  )
}

function Item({
  item: { title, complete, isSelected },
  onToggle,
  // isSelected = false,
  onSelect,
}) {
  return (
    // Most of time, when I create the a layout, I would have a 'div grid at the very bottom' which has no margins since margins can affect the flex box. 
    // I put a wrapper div here to avoid the margins from the items. This gives me a better and more accurate control when it comes to styling.
    <div className='item-wrapper'>
      <div className={`item ${complete ? 'complete' : ''}`}>
        <input className={'checkbox'} type='checkbox' checked={isSelected} onChange={onSelect}/>
        <h1>{title}</h1>
        <button onClick={onToggle}>Toggle complete</button>
      </div>
    </div>
  );
}

function App() {
  const [items, setItems] = useState(() => (new Array(35)).fill(null).map((_, i) => ({ title: `To-do: ${i}`, complete: false, isSelected: false, })));
  const [isBottomMenuOpen, setisBottomMenuOpen] = useState(false);
  const [selectedItemsType, setSelectedItemsType] = useState(selectedItemsTypes.MIXED);

  const toggleItem = (index) => {
    const [_items, _selectedItemsType] = getItemsOnToggle(items, index);
    setSelectedItemsType(_selectedItemsType);
    setItems(_items);
  };

  const toggleItemSelect = (index) => {
    const [_items, hasSelectedItems, _selectedItemsType] = getItemsOnSelectToggle(items, index);
    setItems(_items);
    setisBottomMenuOpen(hasSelectedItems);
    setSelectedItemsType(_selectedItemsType);
  };

  const onBulkComplete = () => {
    const [_items, _selectedItemsType] = getItemsOnBulkCompleteToggle(items, true);
    setItems(_items);
    setSelectedItemsType(_selectedItemsType);
  }

  const onBulkIncomplete = () => {
    const [_items, _selectedItemsType] = getItemsOnBulkCompleteToggle(items, false);
    setItems(_items);
    setSelectedItemsType(_selectedItemsType);
  }

  return (
    <div className="app">
      <header>
        <div className="logo">Sleeping Duck</div>
        <div className="nav">
          <button>I don't do anything</button>
          <button>I also don't do anything</button>
          <button>User</button>
        </div>
      </header>
      <div className="items">
        {items.map((item, i) => (
          <Item
            key={i}
            onToggle={() => toggleItem(i)}
            item={item}
            onSelect={() => toggleItemSelect(i)}
          />
        ))}
      </div>
      <BottomMenu
        isOpen={isBottomMenuOpen}
        selectedItemsType={selectedItemsType}
        onBulkComplete={onBulkComplete}
        onBulkIncomplete={onBulkIncomplete}
      />
    </div>
  );
}

export default App;
