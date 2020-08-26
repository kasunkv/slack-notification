# Generate Slack Token with Slack App

The _v6.x version and above_ of the Slack Notification task will be using the OAuth Access Token to authenticate with the Slack API. Use the following directions to create the OAuth Access Token.

## 1. Create New Slack App

Goto [https://api.slack.com/apps](https://api.slack.com/apps) and click on the **Create New App** button to create a new slack application.

![Create slack app](https://raw.githubusercontent.com/kasunkv/slack-notification/master/screenshots/slack-tokens/1-goto-slack-apps.png)

In the next popup add a new **App Name** and select the **Slack Workspace** and click on the **Create App** button

![Add app name](https://raw.githubusercontent.com/kasunkv/slack-notification/master/screenshots/slack-tokens/2-create-slack-app.png)

## 2. Select the Token Scopes

Once the application is created in the **Add features and functionality** section click on the **Permissions** button to set the token scopes

![Click on permissions](https://raw.githubusercontent.com/kasunkv/slack-notification/master/screenshots/slack-tokens/3-click-on-permissions.png)

Under **User Token Scopes** select the following scopes
* **chat:write** - Send messages on the user's behalf
* **files:write** - Upload, edit and delete files on the user's behalf
* **im:write** - Start direct messages with people on the user's behalf
* **mpim:write** - Start group direct messages with people on the user's behalf
* **users:read** - View people in the workspace


![Select token scopes](https://raw.githubusercontent.com/kasunkv/slack-notification/master/screenshots/slack-tokens/4-add-the-user-token-scopes.png)


## 3. Install the Application in the Workspace

Next step is to install the application in the desired workspace and allow access to the requested scopes. Click on the  **Install App to Workspace** button

![Install app to workspace](https://raw.githubusercontent.com/kasunkv/slack-notification/master/screenshots/slack-tokens/5-install-app-to-workspace.png)

Then on the concent screen click on **Allow** button to give the necessary permissions.

## 4. Copy OAuth Access Token & Use in Azure Pipelines

Finally, copy the **OAuth Access Token** and use it in the **Slack API Token** field.

![Copy the access token](https://raw.githubusercontent.com/kasunkv/slack-notification/master/screenshots/slack-tokens/7-copy-and-use-token.png)