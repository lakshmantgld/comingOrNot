# responsive-fixed-data-table
[![npm version](https://badge.fury.io/js/responsive-fixed-data-table.svg)](http://badge.fury.io/js/responsive-fixed-data-table)
Responsive wrapper for [Facebook's Fixed-Data-Table](https://github.com/facebook/fixed-data-table) grids

## Installation
This module is available as an npm package.

	npm install [--save] responsive-fixed-data-table

## Usage
This module includes minified and non minified UMD builds as well as an ES6 build. You choose!

```js
import React from 'react';
import ResponsiveFixedDataTable from 'responsive-fixed-data-table';
import { Column } from 'fixed-data-table';

export default class ResponsiveTable extends React.Component {
	render() {
		return (
			<ResponsiveFixedDataTable {...tableProps}>
				<Column {...columnsProps} />
			</ResponsiveFixedDataTable>
		);
	}
}
```

All passed props will be passed to the underlying FixedDataTable component. Please check [FixedDataTable docs](http://facebook.github.io/fixed-data-table/api-table.html) for a list of available options.  
Width and height will be overriden to take all the available space of its parent container.

### Additional configuration
**containerStyle** *{Object}*: Additional styles to be set on the container div.  
**refreshRate** *{Number}*: Time in milliseconds to debounce the resize handler.

### React 0.13 compatibility
If you want to use this module with old versions of React and FixedDataTable please check the **v1.5.0-deprecated** branch.