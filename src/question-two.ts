app.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;
    const user = await getUserByEmail(email);
    if (!user) return res.status(404).send('User not found');
    user.password = newPassword;
    await saveUser(user);
    res.send('Password updated successfully');
});

// -- The new password is storage without hashing
// -- The password has no validation(check for length, complexity, or others requirements)
// -- The endpoint allows password resets just by knowing the email, with no verification that the user owns the email address.

app.post('/reset-password', async (req, res) => {
    try {
        const { email, newPassword, resetToken } = req.body;

        // Validate reset token
        if (!await isValidResetToken(email, resetToken)) {
            return res.status(403).send('Invalid or expired reset token');
        }

        // Validate password 
        if (!isPasswordValid(newPassword)) {
            return res.status(400).send('Password does not meet requirements');
        }

        const user = await getUserByEmail(email);
        if (!user) return res.status(404).send('User not found');

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await saveUser(user);
        await invalidateResetToken(email, resetToken);

        res.send('Password updated successfully');
    } catch (error) {
        res.status(500).send('An error occurred during password reset');
    }
});   

// -- Testing
/**
 * 1) Token testing
 *  - Submit request with missing token
 *  - Submit request with expired token
 *  - Submit request with token belonging to different email
 *  - Submit request with invalid token format
 *  - Test for token reuse after password reset
 * 2)Password Testing
 *  - Empty password
 *  - Password below minimum length
 *  - Password without required complexity        
 *  - Previously used passwords
 *  - Extremely long passwords (buffer overflow)
 *  - SQL injection attempts in password field
 * 3) Email testing
 *  - Non-existent email addresses
 *  - SQL injection in email field
 *  - Special characters in email      
 *  - Email format validation
 */