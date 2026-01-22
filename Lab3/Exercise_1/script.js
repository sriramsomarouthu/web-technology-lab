// script.js
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const fields = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        password: document.getElementById('password'),
        confirmPassword: document.getElementById('confirmPassword'),
        age: document.getElementById('age'),
        role: document.getElementById('role'),
        roleSpecific: document.getElementById('roleSpecific'),
        skills: document.getElementById('skills'),
        submitBtn: document.getElementById('submitBtn')
    };

    const errors = {
        name: document.getElementById('nameError'),
        email: document.getElementById('emailError'),
        password: document.getElementById('passwordError'),
        confirm: document.getElementById('confirmError'),
        age: document.getElementById('ageError'),
        role: document.getElementById('roleError'),
        roleSpecific: document.getElementById('roleSpecificError'),
        skills: document.getElementById('skillsError')
    };

    const roleField = document.getElementById('roleField');
    const roleLabel = document.getElementById('roleLabel');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');

    // Role-specific configurations
    const roleRules = {
        Student: { label: 'Student ID', required: true, pattern: /^[0-9]{2}[A-Z]{3}[0-9]{4}$/
 },
        Teacher: { label: 'Employee ID', required: true, pattern: /^[T]\d{5}$/ },
        Admin: { label: 'Admin Code', required: true, pattern: /^[A]\d{6}$/ }
    };

    // Role-specific skills requirements
    const roleSkillsReq = {
        Student: { min: 2, example: 'Data Structures, Algorithms' },
        Teacher: { min: 3, example: 'Deep Learning, Web Development' },
        Admin: { min: 5, example: 'System Admin, Networking, Security' }
    };

    // Validation functions
    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function getPasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    }

    function validateSkills(role) {
        const skillsText = fields.skills.value.trim();
        if (!skillsText) {
            showError(fields.skills, errors.skills, 'Skills are required.');
            return false;
        }
        const skillsList = skillsText.split(',').map(s => s.trim()).filter(s => s);
        const req = roleSkillsReq[role] || { min: 1 };
        if (skillsList.length < req.min) {
            showError(fields.skills, errors.skills, `Enter at least ${req.min} skills (e.g., ${req.example}).`);
            return false;
        }
        clearError(fields.skills, errors.skills);
        return true;
    }

    function updatePasswordStrength() {
        const pw = fields.password.value;
        const strength = getPasswordStrength(pw);
        strengthFill.className = 'strength-fill';
        let text = '';

        if (pw === '') {
            strengthFill.style.width = '0%';
        } else if (strength <= 2) {
            strengthFill.classList.add('weak');
            strengthFill.style.width = '33%';
            text = 'Weak';
        } else if (strength <= 3) {
            strengthFill.classList.add('medium');
            strengthFill.style.width = '66%';
            text = 'Medium';
        } else {
            strengthFill.classList.add('strong');
            strengthFill.style.width = '100%';
            text = 'Strong';
        }
        strengthText.textContent = text;
    }

    function clearError(field, errorEl) {
        field.classList.remove('error');
        errorEl.style.display = 'none';
        errorEl.textContent = '';
    }

    function showError(field, errorEl, msg) {
        field.classList.add('error');
        errorEl.textContent = msg;
        errorEl.style.display = 'block';
    }

    function validateField(fieldId, validator) {
        const value = fields[fieldId].value.trim();
        if (value === '') {
            showError(fields[fieldId], errors[fieldId], `${fields[fieldId].previousElementSibling.textContent} is required.`);
            return false;
        }
        if (validator && !validator.test(value)) {
            showError(fields[fieldId], errors[fieldId], 'Invalid format.');
            return false;
        }
        clearError(fields[fieldId], errors[fieldId]);
        return true;
    }

    // Event listeners
    fields.role.addEventListener('change', function() {
        const role = this.value;
        roleField.classList.toggle('hidden', !role);
        if (role) {
            const rules = roleRules[role];
            roleLabel.textContent = rules.label;
            fields.roleSpecific.required = rules.required;
        }
        validateAll();
    });

    fields.password.addEventListener('input', updatePasswordStrength);
    fields.confirmPassword.addEventListener('input', validateAll);
    fields.skills.addEventListener('input', validateAll);

    ['name', 'email', 'age', 'role', 'roleSpecific'].forEach(id => {
        fields[id].addEventListener('input', validateAll);
    });
    fields.email.addEventListener('input', () => validateField('email', null));

    function validateAll() {
        let isValid = true;
        const role = fields.role.value;

        // Name
        if (!validateField('name', null)) isValid = false;

        // Email
        if (!validateField('email', null) || !validateEmail(fields.email.value)) {
            showError(fields.email, errors.email, 'Enter valid email.');
            isValid = false;
        }

        // Password strength
        const pwStrength = getPasswordStrength(fields.password.value);
        if (role === 'Admin' && pwStrength < 4) {
            showError(fields.password, errors.password, 'Admin requires strong password.');
            isValid = false;
        } else if (pwStrength < 2) {
            showError(fields.password, errors.password, 'Password too weak.');
            isValid = false;
        } else {
            clearError(fields.password, errors.password);
        }

        // Confirm password
        if (fields.password.value !== fields.confirmPassword.value) {
            showError(fields.confirmPassword, errors.confirm, 'Passwords do not match.');
            isValid = false;
        } else {
            clearError(fields.confirmPassword, errors.confirm);
        }

        // Age
        const age = parseInt(fields.age.value);
        if (isNaN(age) || age < 0 || age > 120) {
            showError(fields.age, errors.age, 'Enter valid age.');
            isValid = false;
        } else {
            clearError(fields.age, errors.age);
        }

        // Role
        if (!role) {
            showError(fields.role, errors.role, 'Select a role.');
            isValid = false;
        } else {
            clearError(fields.role, errors.role);
        }

        // Role specific
        if (role && !validateField('roleSpecific', roleRules[role].pattern)) isValid = false;

        // Skills
        if (role && !validateSkills(role)) isValid = false;

        fields.submitBtn.disabled = !isValid;
        return isValid;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateAll()) {
            alert('Registration successful!');
            form.reset();
            fields.submitBtn.disabled = true;
            roleField.classList.add('hidden');
            updatePasswordStrength();
        }
    });
});
