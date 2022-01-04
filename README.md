## 4criskaiReactMaterialGrid for Mendix
Widget that can be used to get an entity data as grid view with many options from we can select from the widget tabs. The user can get the selected entity object value passed to the grid, global search, column search, columns visibility by Boolean and by condition, custom headers, params at columns, custom actions at row level and grid level.

## Features
- Add a dataSource and populate columns and row data
- Hide and Show columns
- Global Search and Column level search
- Add classnames to style
- Add action buttons with in a column

## Usage
The widget needs a context object to work to be able to store the response. You can choose to make this object non-persistent. Configure the data source to retrieve the options to show in the grid.

## Configuration
### General
- Add dataSource and column headers to populate and add visibility.
- Editable: Expression that can be used to indicate whether the widget is editable or not. If left empty, the widget will be editable.
- Data source: Should return the options to be rendered.
- Title: The attribute that is used to show as dropdown option. Should be unique to be able to make a distinction between the items.

### Events
- On Change Action:- 
- Refresh: Widget will only be reset when the context object is refreshed.

### Behavior
