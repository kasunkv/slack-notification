import task = require('vsts-task-lib/task');
import request = require('request');
import path = require('path');

task.setResourcePath(path.join(__dirname, 'task.json'));

async function run() {
    const slackApiBase = 'https://slack.com/api/chat.postMessage';

    // Required Inputs
    let messageAuthor: string = task.getInput('MessageAuthor', true);
    let channel: string = task.getInput('Channel', true);
    let message: string = task.getInput('Message', true);
    let slackApiToken: string = task.getInput('SlackApiToken', true);

    // Optional Inputs
    let iconUrl: string = task.getInput('IconUrl');
    let authorName: string = task.getInput('AuthorName');
    let authorLink: string = task.getInput('AuthorLink');
    let title: string = task.getInput('Title');
    let titleLink: string = task.getInput('TitleLink');
    let preText: string = task.getInput('PreText');
    let text: string = task.getInput('Text');
    let color: string = task.getInput('Color');
    let imageUrl: string = task.getInput('ImageUrl');
    let footerText: string = task.getInput('FooterText');
    let footerIcon: string = task.getInput('FooterIcon');

    let timeString: string = new Date().getTime().toString();
    let timeTicks: string = timeString.substring(0, timeString.length - 3);

    let attachment: object = {
        "title": title,
        "title_link": titleLink,
        "author_name": authorName,
        "author_link": authorLink,
        "pretext": preText,
        "text": text,
        "color": color,
        "image_url": imageUrl,
        "footer": footerText,
        "footer_icon": footerIcon,
        "ts": timeTicks
    };

    let attachmentList: Array<object> = [attachment];
    let attachmentListString = JSON.stringify(attachmentList);

    task.debug(attachmentListString);

    let slackMessageBody: object = {
        "token": slackApiToken,
        "channel": channel,
        "text": message,
        "icon_url": iconUrl,
        "username": messageAuthor,
        "unfurl_links": true, 
        "attachments": attachmentListString,        
        "pretty": 1
    };

    task.debug(JSON.stringify(slackMessageBody));
    
    request
        .post(slackApiBase)
        .form(slackMessageBody)
        .on('response', (response) => {
            task.debug('Slack message posted successfully.');            
        })
        .on('error', () => {
            task.error('Posting slack message failed');
            throw new Error('Failed to post slack message');
        });
}

run();