
export function subject() {
    return `You have received the gift of reading`;
}

export function text(giver_name, receiver_name, message, plan_name, gift_code) {
    return `Dear ${receiver_name},
    
    ${message}
    
    Sincerely, ${giver_name}
    
    To redeem your gift membership, visit bookofthemonth.com/redeem and enter your redemption code.
    
    ${plan_name} membership    
    GIFT CODE: ${gift_code}
    `;
}

export function html(giver_name, receiver_name, message, plan_name, gift_code) {
    return `<tr>
  <td>
    <table cellpadding="40" cellspacing="0" align="center" width="100%" style="background-color:#182747; border: 1px solid #deddd5;" >
        <tr>
          <td style="font-size:28px; font-weight: lighter; font-family: 'Baskerville', 'Times New Roman', 'Times', serif; line-height:110%; color:#ffffff; text-align: center; padding-bottom: 0;" >
            <a href="https://www.bookofthemonth.com" style="color: #ffffff; text-decoration: none;">
            <img src="https://s3.amazonaws.com/bookspan-media/email/botm/logo.gif" alt="Book of the Month" height="auto" width="auto" max-width="200px" style="display: block; margin: auto;" />
            </a>
          </td>
        </tr>
        <tr>
          <td style="font-family: Arial, Helvetica, sans-serif; line-height:150%; color:#FFFFFF; text-align: center; padding-bottom: 0;">
            <h4 style="margin: 0;">YOU HAVE RECEIVED THE GIFT OF READING</h4>
          </td>
        </tr>
          <tr>
            <td style="font-family: Arial, Helvetica, sans-serif; line-height:150%; color:#FFFFFF; text-align: center; padding: 0;">
                <img src="https://s3.amazonaws.com/bookspan-media/email/botm/arabesaque_white.png" alt="Book of the Month" style="display: block;width: 25px;height: 25px;margin-left: auto;margin-right: auto;margin-bottom: 15px;margin-top: 15px;" />
            </td>
          </tr>
          <tr>     
            <td style="font-family: Arial, Helvetica, sans-serif; font-size:13px; line-height:150%; color:#000000; padding-top: 0;">
             <table cellpadding="40" cellspacing="0" align="center" width="100%" style="background-color:#FFFFFF; border: 1px solid #deddd5;" >
                <tr>
                    <td style="padding: 5px;">
             <table cellpadding="40" cellspacing="0" align="center" width="100%" style="background-color:#FFFFFF;border: 1px solid #182747;" >
                <tr>
                    <td style="padding-bottom: 0;">
                      Dear ${receiver_name},
                    </td>
                </tr>
                <tr>
                    <td style="padding-bottom: 0;">
                      ${message}
                    </td>
                </tr>
                <tr>
                    <td style="text-align: right;">                  
                      <span>Sincerely,</span>
                      <br> 
                      <span>${giver_name}</span>
                    </td>
                </tr>
              </table>
              </td></tr></table>
            </td>
          </tr>
          <tr>
            <td style="font-family: Arial, Helvetica, sans-serif; font-size:13px; line-height:150%; color:#FFFFFF; text-align: center; padding-bottom: 0;">
                To redeem your gift membership, visit 
                <br><strong>bookofthemonth.com/gift/redeem</strong> and enter your redemption code.
            </td>
          </tr>
          <tr>
            <td style="font-family: Arial, Helvetica, sans-serif; line-height:150%; color:#FFFFFF; text-align: center; padding: 0;">
                <img src="https://s3.amazonaws.com/bookspan-media/email/botm/arabesaque_white.png" alt="Book of the Month" style="display: block;width: 25px;height: 25px;margin-left: auto;margin-right: auto;margin-bottom: 15px;margin-top: 15px;" />
            </td>
          </tr>
          <tr>
            <td style="font-family: Arial, Helvetica, sans-serif; line-height:150%; color:#FFFFFF; text-align: center; padding-top: 0;">
                ${plan_name} membership
                <br>
                <span style="color: #11afe2;">GIFT CODE: ${gift_code}</span>
            </td>
          </tr>
          <tr>
            <td style="font-family: Arial, Helvetica, sans-serif; font-size:13px; line-height:150%; color:#FFFFFF; text-align: center;">
                <a style="padding: 10px;border: 1px solid #11afe2; background: #11afe2;color: white;text-decoration: none;" href="https://www.bookofthemonth.com/gift/redeem">REDEEM NOW!</a>
            </td>
          </tr>
    </table>
  </td>
</tr>`;
}