# Code Changes for MyUnimo Application

## Overview

This document outlines key code changes I made to fix issues with the MyUnimo application, particularly focusing on:

1. Import errors causing startup failures
2. Frontend dropdown errors after login
3. Registration form dropdown population
4. Email verification functionality

## 1. Fixed Import Errors

The main issue was with absolute vs. relative imports. Here are the key changes:

### backend/__init__.py

Changed absolute imports to relative imports for all controllers and models:

```python
# Before
from src.model.entity.entity import db
from src.model.dto.dto import ma
from src.controller.loginController import loginController
# etc...

# After
from .src.model.entity.entity import db
from .src.model.dto.dto import ma
from .src.controller.loginController import loginController
# etc...
```

### backend/src/controller/loginController.py

Changed the path in imports to fix ModuleNotFoundError:

```python
# Before
from src.model.products.login.login import *
from src.model.products.errorLog.errorLog import *

# After
from ..model.products.login.login import *
from ..model.products.errorLog.errorLog import *
```

### backend/src/model/products/myUnimo/myUnimo.py

Fixed incorrect DTO class names that were causing import errors:

```python
# Before
from ...dto.myUnimo.myUnimo import (MyUnimoClientDto, MyUnimoClientDtoList, MyUnimoClientHistoryDto,
                               MyUnimoClientHistoryDtoList)

# After
from ...dto.myUnimo.myUnimo import (MyUnimoClientDetailsDto, MyUnimoClientDetailsDtoList, 
                                   MyUnimoClientDetailsHistoryDto, MyUnimoClientDetailsHistoryDtoList)

# And correcting variable initializations:
# Before
myUnimoClientDetailsDto = MyUnimoClientDto()
myUnimoClientDetailsDtoList = MyUnimoClientDtoList()
myUnimoClientDetailsDtoListAll = MyUnimoClientDtoList(many=True)

# After
myUnimoClientDetailsDto = MyUnimoClientDetailsDto()
myUnimoClientDetailsDtoList = MyUnimoClientDetailsDtoList()
myUnimoClientDetailsDtoListAll = MyUnimoClientDetailsDtoList(many=True)
```

## 2. Fixed Frontend Dropdown Error

After login, there was an error in UserDropdown.js trying to call forEach on undefined data. Fixed both frontend and backend components:

### Backend Fix: professional.py

```python
# Before
def uploadDocumentsDetails(userId):
    try:
        details = db.session.query(UploadDocuments).filter_by(userId=userId).all()
        return details
    except Exception as e:
        print('uploadDocumentsDetails', e)

# After
def uploadDocumentsDetails(userId):
    try:
        print('uploadDocumentsDetails')
        from ...entity.entity import db
        from ...entity.uploadDocuments.uploadDocuments import UploadDocuments
        
        # Check if userId exists
        if not userId:
            print("Invalid userId")
            return []
            
        # Query the database for documents
        details = db.session.query(UploadDocuments).filter_by(userId=userId).all()
        return details if details else []
    except Exception as e:
        print('uploadDocumentsDetails error:', e)
        return []
```

### Backend Fix: userController.py

```python
# Before
@userController.route('/getUploadFiles', methods=['GET'])
@jwt_required()
def getUploadFiles():
    try:
        # ...code...
        if userId is None or userId == '':
            data = 'Access token is not valid'
            status = 'failed'
            statusCode = 201
        else:
            details = uploadDocumentsDetails(userId)
            data = [
                # ...map details to data...
            ]
            # ...more code...
        return Response(json.dumps({'status': status, 'message': message, 'data': data}),
                    status=statusCode, mimetype='application/json')
    except Exception as e:
        # ...error handling...

# After
@userController.route('/getUploadFiles', methods=['GET'])
@jwt_required()
def getUploadFiles():
    try:
        # ...code...
        if userId is None or userId == '':
            data = []  # Return empty array instead of string
            message = 'Access token is not valid'
            status = 'failed'
            statusCode = 201
        else:
            try:
                details = uploadDocumentsDetails(userId)
                if details:
                    data = [
                        # ...map details to data...
                    ]
                else:
                    data = []
                message = 'Data fetched successfully'
                status = 'success'
                statusCode = 200
            except Exception as inner_e:
                print('Error fetching upload documents:', inner_e)
                data = []
                message = 'Error fetching documents'
                status = 'failed'
                statusCode = 200
        # ...rest of the code...
        return Response(json.dumps({'status': status, 'message': message, 'data': data}),
                    status=statusCode, mimetype='application/json')
    except Exception as e:
        # Always return empty array in error case
        return Response(json.dumps({'status': 'failed', 'message': "Internal Server Error", 'data': []}),
                    status=200, mimetype='application/json')
```

### Frontend Fix: UserDropdown.js

```javascript
// Before
useEffect(() => {
  profilePicture().then((data)=>{
    data.forEach(file => {
      if (file.documentType === 'profile_picture') {
        if(file.imageUrl !== null || file.imageUrl !== ''){
          setImage(file.imageUrl)
        }
      }
    });
  })
}, []);

// After
useEffect(() => {
  profilePicture().then((data)=>{
    if (data && Array.isArray(data)) {
      data.forEach(file => {
        if (file.documentType === 'profile_picture') {
          if(file.imageUrl !== null || file.imageUrl !== ''){
            setImage(file.imageUrl)
          }
        }
      });
    }
  }).catch(error => {
    console.error('Error fetching profile picture:', error);
  });
}, []);
```

### Frontend Fix: CommonFunctions.js

```javascript
// Before
export const getFileDetails = async () => {
  try {
    let userToken = localStorage.getItem("access_token");
    const result = await getFileData('user/getUploadFiles', '', userToken);

    if (result.status === 200) {
      return result.data.data.map(document => ({
        name: document.documentName,
        documentType: document.documentType,
        selectedOption: document.documentSubType || ' ',
        type: document.contentType,
        imageUrl: document.fileUrl,
        id: document.id,
      }))
    } else {
      console.error('Error fetching uploaded documents. Status:', result.status);
    }
  } catch (error) {
    console.error('Error fetching uploaded documents:', error);
  }
};

// After
export const getFileDetails = async () => {
  try {
    let userToken = localStorage.getItem("access_token");
    const result = await getFileData('user/getUploadFiles', '', userToken);

    if (result && result.status === 200 && result.data && result.data.data) {
      return result.data.data.map(document => ({
        name: document.documentName,
        documentType: document.documentType,
        selectedOption: document.documentSubType || ' ',
        type: document.contentType,
        imageUrl: document.fileUrl,
        id: document.id,
      }));
    } else {
      console.error('Error fetching uploaded documents. Status:', result ? result.status : 'No result');
      return [];
    }
  } catch (error) {
    console.error('Error fetching uploaded documents:', error);
    return [];
  }
};
```

## 3. Fixed Registration Form Dropdowns

Created database tables and added lookup data for the registration form dropdowns:

### Created Lookup Entity Models (backend/src/model/entity/lookup/lookup.py)

```python
class LookupConfigure(db.Model):
    __tablename__ = 'lookup_configure'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    lookupCode = db.Column(db.String(255), nullable=False, name='lookup_code')
    lookupName = db.Column(db.String(255), name='lookup_name')
    createdDate = db.Column(db.DateTime, default=datetime.utcnow, name='created_date')
    createdBy = db.Column(db.String(36), name='created_by')


class LookupLevel(db.Model):
    __tablename__ = 'lookup_level'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    lookupCode = db.Column(db.String(255), nullable=False, name='lookup_code')
    levelCode = db.Column(db.String(255), nullable=False, name='level_code')
    levelName = db.Column(db.String(255), name='level_name')
    parentLevelCode = db.Column(db.String(255), name='parent_level_code')
    createdDate = db.Column(db.DateTime, default=datetime.utcnow, name='created_date')
    createdBy = db.Column(db.String(36), name='created_by')


class LookupData(db.Model):
    __tablename__ = 'lookup_data'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    lookupCode = db.Column(db.String(255), nullable=False, name='lookup_code')
    levelCode = db.Column(db.String(255), nullable=False, name='level_code')
    levelData = db.Column(db.String(255), name='level_data')
    isActive = db.Column(db.Boolean, default=True, name='is_active')
    createdDate = db.Column(db.DateTime, default=datetime.utcnow, name='created_date')
    createdBy = db.Column(db.String(36), name='created_by')
```

### Updated Lookup Data Retrieval (backend/src/model/products/lookup/lookup.py)

```python
def getLookData(lookupCode, levelCode):
    try:
        print('Common DB Call')
        query = f"""select id, level_data from lookup_data where lookup_code = '{lookupCode}' AND level_code = '{levelCode}' order by created_date asc;"""
        
        data = dataFetch(query, 'all')
        
        if data:
            # Convert SQL result to a list of dictionaries
            result = []
            for item in data:
                result.append({
                    'id': item[0],
                    'levelData': item[1]
                })
            return result
        else:
            return []
    
    except Exception as e:
        print('Exception', e)
        return []
```

### Script to Add Lookup Data (backend/add_all_lookup_data.py)

```python
# Created lookup data for:
# 1. Registration Types (Immigrant, Professional)
# 2. Desired Destinations
# 3. Referral Sources
# 4. Countries
# 5. Marital Status
# 6. Security Questions

# Example lookup data from the script:
registration_types = [
    {"id": str(uuid.uuid4()), "lookup_code": "4", "level_code": "1", "level_data": "Immigrant"},
    {"id": str(uuid.uuid4()), "lookup_code": "4", "level_code": "1", "level_data": "Professional"}
]

marital_statuses = [
    {"id": str(uuid.uuid4()), "lookup_code": "5", "level_code": "1", "level_data": "Single"},
    {"id": str(uuid.uuid4()), "lookup_code": "5", "level_code": "1", "level_data": "Married"},
    {"id": str(uuid.uuid4()), "lookup_code": "5", "level_code": "1", "level_data": "Divorced"},
    {"id": str(uuid.uuid4()), "lookup_code": "5", "level_code": "1", "level_data": "Widowed"},
    {"id": str(uuid.uuid4()), "lookup_code": "5", "level_code": "1", "level_data": "Separated"}
]
```

## 4. Fixed Email Verification

Updated email verification URLs to point to localhost and created mail configuration:

### backend/src/model/products/mailConfig/mailConfig.py

```python
def sendRegistrationVerification(email):
    try:
        # ...other code...
        
        # Before
        # verification_url = f'http://localhost:3000/pages/verify?email={email}&token={token}'
        verification_url = f'http://sap.immican.ai/pages/verify?email={email}&token={token}'
        
        # After
        verification_url = f'http://localhost:3000/pages/verify?email={email}&token={token}'
        # verification_url = f'http://sap.immican.ai/pages/verify?email={email}&token={token}'
        
        # ...rest of the code...
    except Exception as e:
        # ...error handling...
```

### Created Mail Configuration Records

Created script (backend/create_mail_config.py) to add mail configuration records to the database:

```python
# Sample code from the script
registration_mail_config = MailConfigureInfo(
    isActive=True,
    senderEmail="no-reply@immican.ai",
    password=encrypted_password,
    subject="Email Verification for ImmiCan",
    body="Please verify your email to complete registration.",
    signature="The ImmiCan Team",
    port=587,
    server="smtp.example.com",
    mailFor="Registration",
    key=key_str,
    senderTitle="ImmiCan Registration",
    createdBy="system"
)
```



Changes Summary
1. Fixed import errors that prevented the application from starting
2. Fixed the frontend dropdown error after login
3. Added lookup data for the registration form dropdowns
4. Fixed email verification functionality

# Immigration Roadmap Implementation

## Overview
The Immigration Roadmap is a visual representation of the immigration journey, showing various pathways from visitor to citizenship. It's implemented as an interactive component that allows users to explore different immigration stages and options.

## Key Components

### Data Structure
- The roadmap uses a hierarchical tree data structure where each node represents an immigration stage or option
- Main structure is defined in the `immigrationHierarchy` object with each node having:
  - `name`: The name of the immigration stage
  - `children`: An array of child nodes representing next steps or options

### JSON Data Integration
- The component also supports loading data from an external JSON file (`src/data/immigrationJourney.json`)
- The `parseJourneyData()` function converts the JSON structure into the hierarchical format needed for rendering
- This allows for easy updates to the immigration pathways without code changes

### Styled Components
- Custom styled components create the visual tree structure:
  - `NodeBox`: Individual node boxes with hover and active states
  - `LevelContainer`: Containers for each level of the hierarchy
  - `ChildrenContainer`: Flexbox container for child nodes
  - `ConnectionLine`: Vertical lines connecting nodes
  - `BranchLine`: Horizontal lines branching between siblings

### Icons and Tooltips
- Each immigration stage has a specific icon based on the node type
- `getNodeIcon()` function maps node types to appropriate Material UI icons
- Tooltips provide additional descriptions when hovering over nodes
- `getDescription()` function provides descriptive text for each node type

### Main Components
1. `HierarchyNode`: Recursive component that renders a node and all its children
   - Takes a node object, level, click handler, and selected node state
   - Recursively renders child nodes to create the tree structure

2. `Roadmap`: Main component that manages state and renders the complete roadmap
   - Uses `useState` to track the selected node
   - Renders main immigration stages as a horizontal flow
   - Displays detailed pathways for the selected stage

### Interaction Model
- User clicks on a main immigration stage (Visitor, Prospective Immigrant, etc.)
- The `handleNodeClick` function updates the selected node state
- The component then renders the detailed pathways for the selected stage
- Users can continue clicking on sub-nodes to explore specific pathways

### Visual Design
- The component uses a clean, hierarchical layout with:
  - Main stages displayed horizontally at the top
  - Sub-stages and options displayed as a vertical tree below
  - Active nodes highlighted with the primary color
  - Icons providing visual cues for different node types
  - Tooltips offering additional information

## Code Flow
1. Component initializes with the hierarchical data (either from static definition or JSON)
2. Main immigration stages render as a horizontal flow
3. When a user selects a stage, the component finds the corresponding data
4. The selected stage and its pathways render as a tree structure
5. The recursive `HierarchyNode` component builds the visual hierarchy

## Implementation Benefits
- Modular design allows for easy updates to the immigration pathways
- Visual representation makes complex immigration processes easier to understand
- Interactive elements encourage exploration of different options
- Tooltips provide context and explanation without cluttering the interface
- Responsive design works across different screen sizes

# ImmiScore Implementation

## Overview
The ImmiScore feature is an interactive assessment tool that calculates an immigration eligibility score based on multiple factors across four main categories: Education, Work Experience, Age, and Adaptability.

## Key Components

### Scoring System
- Each category has multiple factors with point values from 0-100
- Factors are weighted within their categories
- Categories are weighted for the overall score calculation
- Final score is presented on a 0-100 scale with assessment feedback

### Data Structure
- `scoringCriteria`: Contains all possible options and their point values for each factor
  - Organized hierarchically by category → factor → option → point value
  - Example: `education.degree.PhD = 100`
- `selections`: Tracks the user's current selections for all factors
  - Maintains the same structure as scoringCriteria for easy access
  - Initialized with default values

### Score Calculation Logic
- `calculateCategoryScore()`: Calculates weighted scores for each category
  - Takes a category name and selections object
  - Applies factor-specific weights within each category
  - Returns a value between 0-100
- `calculateOverallScore()`: Computes the final immigration score
  - Applies category weights to the individual category scores
  - Education (35%), Work Experience (30%), Age (20%), Adaptability (15%)
  - Returns a weighted average on a 0-100 scale

### User Interface Components
- Main Score Card: Displays the overall score with visual feedback
  - Circular indicator shows the overall score prominently
  - Text feedback based on score ranges ("Excellent Candidate", etc.)
- Category Cards: Four cards for the main assessment categories
  - Each card contains:
    - Score display with progress bar
    - Dropdown selectors for each factor within the category
    - Chips showing selected factors
- Recommendations Card: Provides suggestions for improvement

### Interaction Model
- User selects factors from dropdowns in each category
- `handleSelectionChange()` updates the state when selections change
  - Maps the display category names to internal state keys
  - Updates only the specific factor that changed
- Score calculations run automatically when selections change
- UI updates immediately to reflect new scores

## Factor Weighting System
1. **Education (35% of overall score)**
   - Degree (50%): PhD (100), Master's (75), Bachelor's (55), etc.
   - Language Proficiency (35%): Native (100), Advanced (75), etc.
   - Certification (15%): Industry Specific (60), Professional (40), etc.

2. **Work Experience (30% of overall score)**
   - Years (40%): 6+ years (100), 5-6 years (85), 4-5 years (75), etc.
   - Skill Level (30%): Expert (100), Senior (80), Intermediate (60), etc.
   - Relevancy (30%): Highly Relevant (100), Mostly Relevant (70), etc.

3. **Age (20% of overall score)**
   - Age Range (100%): 26-35 (100), 18-25 (70), 36-45 (60), etc.

4. **Adaptability (15% of overall score)**
   - Relatives in Country (60%): Close Relatives (100), Distant (60), None (30)
   - Previous Visits (40%): 3+ visits (100), 1-2 visits (65), Never (30)

## Code Flow
1. Component initializes with default selections
2. User modifies selections through dropdown menus
3. When a selection changes:
   - The selection state updates
   - Category scores recalculate with proper weighting
   - Overall score recalculates with category weighting
   - UI components update to display new scores
4. Feedback text updates based on the overall score thresholds

## Implementation Benefits
- Interactive assessment provides immediate feedback
- Granular scoring with meaningful differentiators
- Weighted calculations create realistic assessment
- Easy-to-understand visual presentation with progress bars
- Modular design allows for future adjustments to scoring criteria

