package com.app.travbro.model

import com.google.gson.annotations.SerializedName

data class EditProfileModel(
    val statusCode: Int,
    val status: Boolean,
    val message: String,
    val result: EditProfileResult,
)

data class EditProfileResult(
    @SerializedName("_id")
    val id: String,
    val firstName: String,
    val lastName: String,
    @SerializedName("profile_image")
    val profileImage: String,
    val dob: String,
    val email: String,
    val password: String,
    val gender: String,
    @SerializedName("mobile_number")
    val mobileNumber: String,
    val token: String,
    val otp: Int,
    @SerializedName("saved_restaurants")
    val savedRestaurants: List<String>,
    @SerializedName("saved_bars")
    val savedBars: List<Any?>,
    @SerializedName("saved_hotels")
    val savedHotels: List<Any?>,
    @SerializedName("saved_adventures")
    val savedAdventures: List<Any?>,
    @SerializedName("created_at")
    val createdAt: String,
    @SerializedName("updated_at")
    val updatedAt: String,
    @SerializedName("is_deleted")
    val isDeleted: Boolean,
    @SerializedName("is_verified")
    val isVerified: Boolean,
    @SerializedName("is_signup_complete")
    val isSignupComplete: Boolean,
    @SerializedName("is_block")
    val isBlock: Boolean,
)
