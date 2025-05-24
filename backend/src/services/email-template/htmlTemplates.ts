export const htmlTemplates = {
    "otp-verification": {
        subject: "OTP Verification",
        html: (
            otp: string,
            name?: string,
            toEmail?: string
        ) => `<body style="word-spacing: normal; background-color: #fafafa">
    <div
      style="
        display: none;
        font-size: 1px;
        color: #ffffff;
        line-height: 1px;
        max-height: 0px;
        max-width: 0px;
        opacity: 0;
        overflow: hidden;
      "
    >
      OTP for email confirmation
    </div>
    <div style="background-color: #fafafa" lang="und" dir="auto">
      <table
        align="center"
        border="0"
        cellpadding="0"
        cellspacing="0"
        role="presentation"
        style="width: 100%"
      >
        <tbody>
          <tr>
            <td>
              <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
              <div style="margin: 0px auto; max-width: 600px">
                <table
                  align="center"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="width: 100%"
                >
                  <tbody>
                    <tr>
                      <td
                        style="
                          direction: ltr;
                          font-size: 0px;
                          padding: 16px;
                          text-align: center;
                        "
                      >
                        <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" width="600px" ><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:568px;" width="568" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
                        <div
                          style="
                            background: #ffffff;
                            background-color: #ffffff;
                            margin: 0px auto;
                            border-radius: 8px;
                            max-width: 568px;
                          "
                        >
                          <table
                            align="center"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            role="presentation"
                            style="
                              background: #ffffff;
                              background-color: #ffffff;
                              width: 100%;
                              border-radius: 8px;
                            "
                          >
                            <tbody>
                              <tr>
                                <td
                                  style="
                                    direction: ltr;
                                    font-size: 0px;
                                    padding: 16px;
                                    text-align: center;
                                  "
                                >
                                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:536px;" ><![endif]-->
                                  <div
                                    class="mj-column-per-100 mj-outlook-group-fix"
                                    style="
                                      font-size: 0px;
                                      text-align: left;
                                      direction: ltr;
                                      display: inline-block;
                                      vertical-align: top;
                                      width: 100%;
                                    "
                                  >
                                    <table
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      role="presentation"
                                      width="100%"
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            style="
                                              vertical-align: top;
                                              padding: 32px;
                                            "
                                          >
                                            <table
                                              border="0"
                                              cellpadding="0"
                                              cellspacing="0"
                                              role="presentation"
                                              style=""
                                              width="100%"
                                            >
                                              <tbody>
                                                <tr>
                                                  <td
                                                    align="center"
                                                    style="
                                                      font-size: 0px;
                                                      padding: 10px 25px;
                                                      padding-bottom: 16px;
                                                      word-break: break-word;
                                                    "
                                                  >
                                                    <table
                                                      border="0"
                                                      cellpadding="0"
                                                      cellspacing="0"
                                                      role="presentation"
                                                      style="
                                                        border-collapse: collapse;
                                                        border-spacing: 0px;
                                                      "
                                                    >
                                                      <tbody>
                                                        <tr>
                                                          <td
                                                            style="width: 180px"
                                                          >
                                                            <img
                                                              alt="LogoIpsum"
                                                              src="https://ik.imagekit.io/xouyyp7zq/logo-main.svg"
                                                              style="
                                                                border: 0;
                                                                display: block;
                                                                outline: none;
                                                                text-decoration: none;
                                                                height: auto;
                                                                width: 100%;
                                                                font-size: 13px;
                                                              "
                                                              width="180"
                                                              height="auto"
                                                            />
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td
                                                    align="center"
                                                    style="
                                                      font-size: 0px;
                                                      padding: 0;
                                                      word-break: break-word;
                                                    "
                                                  >
                                                    <div
                                                      style="
                                                        font-family: Inter,
                                                          Arial;
                                                        font-size: 13px;
                                                        line-height: 1;
                                                        text-align: center;
                                                        color: #000000;
                                                      "
                                                    >
                                                      <h1
                                                        style="margin: 16px 0px"
                                                      >
                                                        Please confirm your
                                                        email
                                                      </h1>
                                                      <p>
                                                        Use this code to confirm
                                                        your email and complete
                                                        signup.
                                                      </p>
                                                    </div>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                  <!--[if mso | IE]></td><td class="" style="vertical-align:top;width:250px;" ><![endif]-->
                                  <div
                                    class="mj-column-px-250 mj-outlook-group-fix"
                                    style="
                                      font-size: 0px;
                                      text-align: left;
                                      direction: ltr;
                                      display: inline-block;
                                      vertical-align: top;
                                      width: 100%;
                                    "
                                  >
                                    <table
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      role="presentation"
                                      width="100%"
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            style="
                                              background-color: #ebe3ff;
                                              border-radius: 8px;
                                              vertical-align: top;
                                              padding: 16px;
                                            "
                                          >
                                            <table
                                              border="0"
                                              cellpadding="0"
                                              cellspacing="0"
                                              role="presentation"
                                              style=""
                                              width="100%"
                                            >
                                              <tbody>
                                                <tr>
                                                  <td
                                                    align="center"
                                                    style="
                                                      font-size: 0px;
                                                      padding: 0;
                                                      word-break: break-word;
                                                    "
                                                  >
                                                    <div
                                                      style="
                                                        font-family: Inter,
                                                          Arial;
                                                        font-size: 32px;
                                                        font-weight: 700;
                                                        letter-spacing: 16px;
                                                        line-height: 32px;
                                                        text-align: center;
                                                        color: #000000;
                                                      "
                                                    >
                                                      <p
                                                        style="
                                                          font-size: 32px;
                                                          margin: 0px;
                                                          margin-right: -16px;
                                                          padding: 0px;
                                                        "
                                                      >
                                                        ${otp}
                                                      </p>
                                                    </div>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                  <!--[if mso | IE]></td><td class="" style="vertical-align:top;width:536px;" ><![endif]-->
                                  <div
                                    class="mj-column-per-100 mj-outlook-group-fix"
                                    style="
                                      font-size: 0px;
                                      text-align: left;
                                      direction: ltr;
                                      display: inline-block;
                                      vertical-align: top;
                                      width: 100%;
                                    "
                                  >
                                    <table
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      role="presentation"
                                      width="100%"
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            style="
                                              vertical-align: top;
                                              padding-top: 16px;
                                            "
                                          >
                                            <table
                                              border="0"
                                              cellpadding="0"
                                              cellspacing="0"
                                              role="presentation"
                                              style=""
                                              width="100%"
                                            >
                                              <tbody>
                                                <tr>
                                                  <td
                                                    align="center"
                                                    style="
                                                      font-size: 0px;
                                                      padding: 10px 25px;
                                                      word-break: break-word;
                                                    "
                                                  >
                                                    <div
                                                      style="
                                                        font-family: Inter,
                                                          Arial;
                                                        font-size: 13px;
                                                        line-height: 1;
                                                        text-align: center;
                                                        color: #555555;
                                                      "
                                                    >
                                                      <p>
                                                        This code is valid for
                                                        5 minutes.
                                                      </p>
                                                    </div>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                  <!--[if mso | IE]></td></tr></table><![endif]-->
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <!--[if mso | IE]></td></tr></table></td></tr></table><![endif]-->
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>`,
    },
    "password-reset": {
        subject: "Reset Password",
        html: (
            otp: string,
            name?: string,
            toEmail?: string
        ) => `<body style="word-spacing: normal; background-color: #fafafa">
    <div
      style="
        display: none;
        font-size: 1px;
        color: #ffffff;
        line-height: 1px;
        max-height: 0px;
        max-width: 0px;
        opacity: 0;
        overflow: hidden;
      "
    >
     Reset Your Password
    </div>
    <div style="background-color: #fafafa" lang="und" dir="auto">
      <table
        align="center"
        border="0"
        cellpadding="0"
        cellspacing="0"
        role="presentation"
        style="width: 100%"
      >
        <tbody>
          <tr>
            <td>
              <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
              <div style="margin: 0px auto; max-width: 600px">
                <table
                  align="center"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="width: 100%"
                >
                  <tbody>
                    <tr>
                      <td
                        style="
                          direction: ltr;
                          font-size: 0px;
                          padding: 16px;
                          text-align: center;
                        "
                      >
                        <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" width="600px" ><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:568px;" width="568" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
                        <div
                          style="
                            background: #ffffff;
                            background-color: #ffffff;
                            margin: 0px auto;
                            border-radius: 8px;
                            max-width: 568px;
                          "
                        >
                          <table
                            align="center"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            role="presentation"
                            style="
                              background: #ffffff;
                              background-color: #ffffff;
                              width: 100%;
                              border-radius: 8px;
                            "
                          >
                            <tbody>
                              <tr>
                                <td
                                  style="
                                    direction: ltr;
                                    font-size: 0px;
                                    padding: 16px;
                                    text-align: center;
                                  "
                                >
                                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:536px;" ><![endif]-->
                                  <div
                                    class="mj-column-per-100 mj-outlook-group-fix"
                                    style="
                                      font-size: 0px;
                                      text-align: left;
                                      direction: ltr;
                                      display: inline-block;
                                      vertical-align: top;
                                      width: 100%;
                                    "
                                  >
                                    <table
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      role="presentation"
                                      width="100%"
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            style="
                                              vertical-align: top;
                                              padding: 32px;
                                            "
                                          >
                                            <table
                                              border="0"
                                              cellpadding="0"
                                              cellspacing="0"
                                              role="presentation"
                                              style=""
                                              width="100%"
                                            >
                                              <tbody>
                                                <tr>
                                                  <td
                                                    align="center"
                                                    style="
                                                      font-size: 0px;
                                                      padding: 10px 25px;
                                                      padding-bottom: 16px;
                                                      word-break: break-word;
                                                    "
                                                  >
                                                    <table
                                                      border="0"
                                                      cellpadding="0"
                                                      cellspacing="0"
                                                      role="presentation"
                                                      style="
                                                        border-collapse: collapse;
                                                        border-spacing: 0px;
                                                      "
                                                    >
                                                      <tbody>
                                                        <tr>
                                                          <td
                                                            style="width: 180px"
                                                          >
                                                            <img
                                                              alt="LogoIpsum"
                                                              src="https://ik.imagekit.io/xouyyp7zq/logo-main.svg"
                                                              style="
                                                                border: 0;
                                                                display: block;
                                                                outline: none;
                                                                text-decoration: none;
                                                                height: auto;
                                                                width: 100%;
                                                                font-size: 13px;
                                                              "
                                                              width="180"
                                                              height="auto"
                                                            />
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td
                                                    align="center"
                                                    style="
                                                      font-size: 0px;
                                                      padding: 0;
                                                      word-break: break-word;
                                                    "
                                                  >
                                                    <div
                                                      style="
                                                        font-family: Inter,
                                                          Arial;
                                                        font-size: 13px;
                                                        line-height: 1;
                                                        text-align: center;
                                                        color: #000000;
                                                      "
                                                    >
                                                      <h1
                                                        style="margin: 16px 0px"
                                                      >
                                                        Reset Password Link
                                                      </h1>
                                                      <p>
                                                        Use this Link to reset your password.
                                                      </p>
                                                    </div>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                  <!--[if mso | IE]></td><td class="" style="vertical-align:top;width:250px;" ><![endif]-->
                                  <div
                                    class="mj-column-px-250 mj-outlook-group-fix"
                                    style="
                                      font-size: 0px;
                                      text-align: left;
                                      direction: ltr;
                                      display: inline-block;
                                      vertical-align: top;
                                      width: 100%;
                                    "
                                  >
                                    <table
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      role="presentation"
                                      width="100%"
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            style="
                                              background-color: #ebe3ff;
                                              border-radius: 8px;
                                              vertical-align: top;
                                              padding: 16px;
                                            "
                                          >
                                            <table
                                              border="0"
                                              cellpadding="0"
                                              cellspacing="0"
                                              role="presentation"
                                              style=""
                                              width="100%"
                                            >
                                              <tbody>
                                                <tr>
                                                  <td
                                                    align="center"
                                                    style="
                                                      font-size: 0px;
                                                      padding: 0;
                                                      word-break: break-word;
                                                    "
                                                  >
                                                    <div
                                                      style="
                                                        font-family: Inter,
                                                          Arial;
                                                        font-size: 14px;
                                                        font-weight: 700;
                                                        text-align: center;
                                                        color: #000000;
                                                      "
                                                    >
                                                      <a
                                                      href="${otp}"
                                                        style="
                                                          font-size: 14px;
                                                          margin: 0px;
                                                          margin-right: -16px;
                                                          padding: 0px;
                                                        "
                                                        target="_blank"
                                                      >
                                                        ${otp}
                                                      </a>
                                                    </div>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                  <!--[if mso | IE]></td><td class="" style="vertical-align:top;width:536px;" ><![endif]-->
                                  <div
                                    class="mj-column-per-100 mj-outlook-group-fix"
                                    style="
                                      font-size: 0px;
                                      text-align: left;
                                      direction: ltr;
                                      display: inline-block;
                                      vertical-align: top;
                                      width: 100%;
                                    "
                                  >
                                    <table
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      role="presentation"
                                      width="100%"
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            style="
                                              vertical-align: top;
                                              padding-top: 16px;
                                            "
                                          >
                                            <table
                                              border="0"
                                              cellpadding="0"
                                              cellspacing="0"
                                              role="presentation"
                                              style=""
                                              width="100%"
                                            >
                                              <tbody>
                                                <tr>
                                                  <td
                                                    align="center"
                                                    style="
                                                      font-size: 0px;
                                                      padding: 10px 25px;
                                                      word-break: break-word;
                                                    "
                                                  >
                                                    <div
                                                      style="
                                                        font-family: Inter,
                                                          Arial;
                                                        font-size: 13px;
                                                        line-height: 1;
                                                        text-align: center;
                                                        color: #555555;
                                                      "
                                                    >
                                                      <p>
                                                        This Link is valid for
                                                        5 minutes.
                                                      </p>
                                                    </div>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                  <!--[if mso | IE]></td></tr></table><![endif]-->
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <!--[if mso | IE]></td></tr></table></td></tr></table><![endif]-->
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>`,
    },
};
