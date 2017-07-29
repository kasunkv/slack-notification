"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const task = require("vsts-task-lib/task");
const request = require("request");
const path = require("path");
task.setResourcePath(path.join(__dirname, 'task.json'));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const slackApiBase = 'https://slack.com/api/chat.postMessage';
        // gather inputs
        let messageAuthor = task.getInput('MessageAuthor', true);
        let channel = task.getInput('Channel', true);
        let message = task.getInput('Message', true);
        let slackApiToken = task.getInput('SlackApiToken', true);
        let iconUrl = task.getInput('IconUrl');
        let authorName = task.getInput('AuthorName');
        let authorLink = task.getInput('AuthorLink');
        let title = task.getInput('Title');
        let titleLink = task.getInput('TitleLink');
        let preText = task.getInput('PreText');
        let text = task.getInput('Text');
        let color = task.getInput('Color');
        let imageUrl = task.getInput('ImageUrl');
        let footerText = task.getInput('FooterText');
        let footerIcon = task.getInput('FooterIcon');
        let attachment = {
            "title": title,
            "title_link": titleLink,
            "author_name": authorName,
            "author_link": authorLink,
            "pretext": preText,
            "text": text,
            "color": color,
            "image_url": imageUrl,
            "footer": footerText,
            "footer_icon": footerIcon
        };
        let attachmentList = [attachment];
        let attachmentListString = JSON.stringify(attachmentList);
        task.debug(attachmentListString);
        let slackMessageBody = {
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
    });
}
run();
