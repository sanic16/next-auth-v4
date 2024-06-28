export const activationTemplate = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Activation Email</title>
    </head>
    <body>
        <div>
        <h1>Hi {{name}},</h1>
        <p>
            Please click the link below to activate your account:
            <a href="{{url}}">{{url}}</a>
        </p>
        </div>
    </body>
`;
