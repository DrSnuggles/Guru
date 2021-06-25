/* ErrorMailer
  by DrSnuggles
  Main use: Transport of JS errors
  History: 25.06.2021 Initial project start without sheet
*/

//
// HTTP event listeners
//
function doPost(e) {
  return main(e)
}
function doGet(e) {
  return main(e)
}

function main(e) {

  // check params
  if (!(e && e.postData && e.postData.contents)) return badExit('post')
  let j = JSON.parse( e.postData.contents )
  if (!(j && j.msg && j.url && j.line && j.col && j.stack && j.agent && j.screen && j.window)) return badExit('data')

  // filter for allowed URLs
  const allowedURLs = ['drsnuggles.github.io','mstest.net']
  const tstURL = j.url.toLowerCase().split('/')[2]
  if (allowedURLs.indexOf(tstURL) === -1) return badExit(tstURL)

  // prepare mail
  const to = 'YOUR@MAIL.DOM'
  const subject = 'Guru Meditation from '+ j.url
  const body = `<p>Look Dev,</p>
    <p>I can see you\'re really upset about this.<br/>
    I honestly think you ought to sit down calmly, take a stress pill, and think things over.</p>
    <b>Time:</b> ${new Date()}<br/>
    <b>URL:</b> ${j.url}<br/>
    <b>Err:</b> ${j.stack.replace(/\n/g,'<br/>')}<br/>
    <b>Agent:</b> ${j.agent}<br/>
    <b>Screen:</b> ${j.screen}<br/>
    <b>Window:</b> ${j.window}
    `
  MailApp.sendEmail({to:to, subject:subject, htmlBody:body})

  return ContentService.createTextOutput(JSON.stringify({status:"OK"}))
  .setMimeType(ContentService.MimeType.JSON)

}

function badExit(reason) {
  return ContentService.createTextOutput(JSON.stringify({status:reason}))
  .setMimeType(ContentService.MimeType.JSON)
}
