export const forgotPasswordTemplate = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Forgot Password Email</title>
    </head>
    <body>
        <div>
        <h1>Hi {{name}},</h1>
        <p>
            Please click the link below to reset your password:
            <a href="{{url}}">{{url}}</a>
        </p>
        </div>
    </body>
`;
