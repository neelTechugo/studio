package com.app.travbro.model

data class EditSendOTPModel(
    val statusCode: Int,
    val status: Boolean,
    val message: String,
    val result: Any?,
)
