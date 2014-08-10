admin = User.find_or_initialize_by(email:"admin@lmsha.com")
admin.role_id = 4
admin.name = "LMHS Admin"
admin.password = admin.password_confirmation = "aluminium"
admin.save!