package com.app.travbro.model

import com.google.gson.annotations.SerializedName

data class BarModel(
    val statusCode: Int,
    val status: Boolean,
    val message: String,
    val result: ArrayList<BarResult>,
)

data class BarResult(
    @SerializedName("_id")
    val id: String,
    val serviceName: String,
    val serviceType: String,
    val vendorName: String,
    val filters: ArrayList<BarFilter>,
    val mobileNumber: String?,
    val vendorId: BarVendorId,
    val city: String,
    val priceForOne: Long,
    val details: BarDetails,
    val reviews: List<Any?>,
    val menuImages: List<String>,
    val photos: List<String>,
    @SerializedName("created_at")
    val createdAt: String,
    @SerializedName("updated_at")
    val updatedAt: String,
    @SerializedName("is_deleted")
    val isDeleted: Boolean,
    @SerializedName("is_block")
    val isBlock: Boolean,
    @SerializedName("is_saved")
    val isSaved: Boolean,
)

data class BarFilter(
    @SerializedName("_id")
    val id: String,
    val filterName: String,
)
data class BarVendorId(
    @SerializedName("_id")
    val id: String,
    @SerializedName("purchased_plan_price")
    val purchasedPlanPrice: Int,
)

data class BarDetails(
    val barType: String,
    val openingClosingTime: List<BarOpeningClosingTime>,
    val aboutBar: String,
    val address: BarAddress,
    val searchTags: List<String>,
    val menuImages: List<Any?>?,
    val photos: List<Any?>?,
)

data class BarOpeningClosingTime(
    val day: String,
    val from: BarFrom,
    val to: BarTo,
)

data class BarFrom(
    val time: String,
    val type: String,
)

data class BarTo(
    val time: String,
    val type: String,
)

data class BarAddress(
    val lat: Double,
    val Int: Double,
)

data class BarReview(
    val reviewType: String,
    val reviewText: String,
    val serviceId: String,
    val userName: String,
    val image: String,
)

