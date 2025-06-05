package com.app.travbro.model

import com.google.gson.annotations.SerializedName

data class FAQModel(
    val statusCode: Int,
    val status: Boolean,
    val message: String,
    val result: ArrayList<FAQResult>,
)

data class FAQResult(
    @SerializedName("_id")
    val id: String,
    val question: String,
    val answer: String,
    @SerializedName("created_at")
    val createdAt: String,
    @SerializedName("updated_at")
    val updatedAt: String,
    @SerializedName("is_deleted")
    val isDeleted: Boolean,
)
