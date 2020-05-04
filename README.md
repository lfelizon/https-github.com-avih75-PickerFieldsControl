# Custom Control for Work Item Form

![Control](img/logo.png)

### Usage ###

1. Download the repository.
2. Open the Command Prompt and change to the directory where you cloned the project. 
3. Make This Steps : 
    1. Run `npm install` to install required dependencies.
    2. Run `npm install -g grunt` to install a global copy of grunt.
    3. Run `npm install -g tfx-cli`
    4. Check the category value in the 'vss-extension.json' file 
        1. "Plan and track" for TFS 2017
        2. "Azure Boards" for TFS 2019
    5. Run `grunt package-dev`.
    6. Navigate to your TFS. and Go to Marketplace. 
    7. Click "Browse local extensions".
    8. Scroll down and click on the "Manage Extensions".
    9. Click "Upload new extension".
    10. Drag and Drop the generated file from your packaged project (vsix). 
    11. Click "Upload".
    12. Hover over the extension when it appears in the list, and click "Install".

This should should install the extension in your collection.  
Next step will add the control to the work item form.

# Define the extension in Azure DevOps

There are nine inputs parameters, four of them are optional.  
*Control Name* : The name of the control (you can put more than one). This name will be used to save the list values in the storage, so it is important to provide meaningful name(s).  
*FieldName* (1-4) : The field name that the user sees.  
*Field* (1-4) : The optional values that the user can select.  
*FieldName* and *Field* (3-4) are optional (if you want to cascade more the 2 lists).

![Layout Customization](img/A.png)
![Layout Customization](img/B.png)

# Create CSV File

Create Your CSV file, you can put thousands of values  
Pay attenshion to write the values correctly, and do not add spaces in the end of the value  
Save the file ... file name must be as the name of the control name -> controlName.csv

![Layout Customization](img/C.png)

# Upload the CSV file

Use the action menu added in the work item Form.  
"Upload Dependencies"

![Layout Customization](img/D.png)

# Use your Controller

![Layout Customization](img/E.png)

# If you still working with xml

Set your fields

![Layout Customization](img/F1.png)

Set the extenshion

![Layout Customization](img/F2.png)

Add the control to the view

![Layout Customization](img/F3.png)


Contact me avih75@gmail.com
