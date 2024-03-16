# Tasker - A Project Management Application
* Only supports images initially for files.
  
## Features
### User Authentication and Management
* User registration
* User login
* Profile management - upload and update avatar, update name, email, password, etc.

### Team Management
* Create new teams.
* View a list of teams you are in.
* Invite users to teams if owner.
* Accept or reject team invites.
* View members within a team.
* Leave a team.
* Ban members of teams if owner.

### Project Management
* Create personal projects.
* Create team projects.
* View and manage project details (title, description, etc)

### Project Board Management
* Create boards within projects.
* Edit and delete boards.

### Project Board Card Management
* Create cards within boards.
* Edit and delete cards.
* Drag and drop cards between boards.
* Comment on cards - with or without images.

## Database Design
* file - id originalName key size mimeType uploaderId uploadedAt
* role - id name
* user - id firstName lastName email password bio avatarFileId refreshToken registeredAt lastLoginAt
* userRole - userId roleId
* team - id title description logoImageId ownerId
* teamMember - id teamId userId isBanned invitationDate joinDate leftDate
* project - id authorId title description teamId (teamId null if personal) createdAt updatedAt
* projectBoard - id projectId title description authorId createdAt updatedAt
* projectCard - id projectBoardId title description authorId createdAt updatedAt
* projectCardComment - id projectCardId comment imgFileId authorId

