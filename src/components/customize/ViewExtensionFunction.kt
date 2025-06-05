package extentions

import android.animation.ValueAnimator
import android.annotation.SuppressLint
import android.app.Activity
import android.content.Context
import android.content.ContextWrapper
import android.database.Cursor
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Matrix
import android.media.MediaMetadataRetriever
import android.net.Uri
import android.os.ParcelFileDescriptor
import android.provider.Settings
import android.view.View
import android.view.inputmethod.InputMethodManager
import android.widget.EditText
import android.widget.ImageView
import android.widget.ScrollView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import androidx.lifecycle.MutableLiveData
import androidx.swiperefreshlayout.widget.CircularProgressDrawable
import com.bumptech.glide.Glide
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.FileDescriptor
import java.io.FileInputStream
import java.io.FileOutputStream
import java.io.IOException
import java.io.InputStream
import java.io.OutputStream
import java.text.ParseException
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale
import java.util.TimeZone
import java.util.concurrent.TimeUnit


// Get Activity Context from Any View
fun View.getParentActivity(): AppCompatActivity? {
    var context = this.context
    while (context is ContextWrapper) {
        if (context is AppCompatActivity) {
            return context
        }
        context = context.baseContext
    }
    return null
}

fun hideKeyboard(activity: Activity) {
    val imm = activity.getSystemService(Activity.INPUT_METHOD_SERVICE) as InputMethodManager
    //Find the currently focused view, so we can grab the correct window token from it.
    var view = activity.currentFocus
    //If no view currently has focus, create a new one, just so we can grab a window token from it
    if (view == null) {
        view = View(activity)
    }
    imm.hideSoftInputFromWindow(view.windowToken, 0)
}

@SuppressLint("Recycle")
fun Uri.getBitMap(context: Context): Bitmap
{
    val parcelFileDescriptor=context.contentResolver.openFileDescriptor(this,"r")
    val fileDescriptor: FileDescriptor =parcelFileDescriptor!!.fileDescriptor
    val bitmap= BitmapFactory.decodeFileDescriptor(fileDescriptor)
    parcelFileDescriptor.close()
    return bitmap

}

fun Uri.createVideoThumb(context: Context): Bitmap? {
    try {
        val mediaMetadataRetriever = MediaMetadataRetriever()
        mediaMetadataRetriever.setDataSource(context, this)
        return mediaMetadataRetriever.frameAtTime
    } catch (ex: Exception) {
        Toast
            .makeText(context, "Error retrieving bitmap", Toast.LENGTH_SHORT)
            .show()
    }
    return null

}

fun  Uri.getVideoPath(context: Context):String?
{
    var path=""
    var cursor: Cursor?=null
    try {

        val projection= arrayOf("_display_name")

        cursor=context.contentResolver.query(this,projection,null,null,null)
        cursor!!.moveToFirst()

        val filename=cursor.getString(cursor.getColumnIndexOrThrow("_display_name"))
        val  file= File(context.cacheDir,filename)
        SaveFileCache(context,this,file)
        return file.absolutePath
    }catch (e:Exception)
    {
        Toast.makeText(context, "Exception :"+e.message, Toast.LENGTH_SHORT).show()
    }finally {
        if (cursor!=null)
            cursor.close()
    }

    return null
}

private fun SaveFileCache(context: Context,uri: Uri,destFile: File?)
{
    try {
        val pfd: ParcelFileDescriptor =
            context.contentResolver.openFileDescriptor(uri, "r")!!
        if (pfd != null) {
            val fd: FileDescriptor = pfd.getFileDescriptor()
            val fileInputStream: InputStream = FileInputStream(fd)
            val fileOutputStream: OutputStream = FileOutputStream(destFile)
            val buffer = ByteArray(1024)
            var length: Int
            while (fileInputStream.read(buffer).also { length = it } > 0) {
                fileOutputStream.write(buffer, 0, length)
            }

            fileOutputStream.flush()
            fileInputStream.close()
            fileOutputStream.close()
            pfd.close()
        }
    } catch (e: IOException) {
        Toast.makeText(context, "Exception to save file "+e.message, Toast.LENGTH_SHORT).show()
        //Timber.w(e)
    }
}


fun getMonthFormat(monthNumber: Int): String? {
    var monthName = ""
    if (monthNumber in 0..11) try {
        val calendar = Calendar.getInstance()
        calendar[Calendar.MONTH] = monthNumber
        val simpleDateFormat = SimpleDateFormat("MM")
        //simpleDateFormat.setCalendar(calendar);
        monthName = simpleDateFormat.format(calendar.time)
    } catch (e: Exception) {
        if (e != null) e.printStackTrace()
    }
    return monthName
}

fun animateviewwidth(view11: View) {
    val valueAnimator = ValueAnimator.ofInt(view11.measuredWidth, view11.measuredWidth+100 )
    valueAnimator.duration = 500L
    valueAnimator.addUpdateListener {
        val animatedValue = valueAnimator.animatedValue as Int
        val layoutParams = view11.layoutParams
        layoutParams.width = animatedValue
        view11.layoutParams = layoutParams
    }
    valueAnimator.start()

}

fun getDateDigitName(monthNumber: Int): String? {
    var monthName = ""
    if (monthNumber in 0..31) try {
        val calendar = Calendar.getInstance()
        calendar[Calendar.DAY_OF_MONTH] = monthNumber
        val simpleDateFormat = SimpleDateFormat("dd")
        //simpleDateFormat.setCalendar(calendar);
        monthName = simpleDateFormat.format(calendar.time)
    } catch (e: Exception) {
        if (e != null) e.printStackTrace()
    }
    return monthName
}

fun getMonthDigitName(monthNumber: Int): String? {
    var monthName = ""
    if (monthNumber in 0..11) try {
        val calendar = Calendar.getInstance()
        calendar[Calendar.MONTH] = monthNumber
        val simpleDateFormat = SimpleDateFormat("MM")
        //simpleDateFormat.setCalendar(calendar);
        monthName = simpleDateFormat.format(calendar.time)
    } catch (e: Exception) {
        if (e != null) e.printStackTrace()
    }
    return monthName
}

fun isLettersOrDigits(chars: String): Boolean {
    return chars.none { it !in 'A'..'Z' && it !in 'a'..'z' && it !in '0'..'9' }
}

fun covertTimeToText(dataDate: String?): String? {
    var convTime: String? = null
    val prefix = ""
    val suffix = "Ago"
    try {

        val dateFormat = SimpleDateFormat("yyyy-MM-dd hh:mm a")
        val pasTime = dataDate?.let { convertTime(it) }?.let { dateFormat.parse(it) }
        dateFormat.timeZone = TimeZone.getTimeZone("Local")
        val nowTime = Date()
        val dateDiff = nowTime.time - pasTime?.time!!

        val second: Long = TimeUnit.MILLISECONDS.toSeconds(dateDiff)
        val minute: Long = TimeUnit.MILLISECONDS.toMinutes(dateDiff)
        val hour: Long = TimeUnit.MILLISECONDS.toHours(dateDiff)
        val day: Long = TimeUnit.MILLISECONDS.toDays(dateDiff)
        if (second < 60) {
            convTime = "$second Seconds $suffix"
        } else if (minute < 60) {
            convTime = "$minute Minutes $suffix"
        } else if (hour < 24) {
            convTime = "$hour Hours $suffix"
        } else if (day >= 7) {
            convTime = if (day > 360) {
                (day / 360).toString() + " Years " + suffix
            } else if (day > 30) {
                (day / 30).toString() + " Months " + suffix
            } else {
                (day / 7).toString() + " Week " + suffix
            }
        } else if (day < 7) {
            convTime = "$day Days $suffix"
        }

    } catch (e: ParseException) {
        e.printStackTrace()
        // Log.e("ConvTimeE", e.getMessage())
    }
    return convTime
}

fun convertDate(day: String): String {
    val inputPattern = "yyyy-MM-dd hh:mm:ss"
    val outputPattern = "EEE hh:mm a dd MMM,yyyy"
    val inputFormat = SimpleDateFormat(inputPattern, Locale.getDefault())
    val outputFormat = SimpleDateFormat(outputPattern, Locale.getDefault())
    inputFormat.timeZone = TimeZone.getTimeZone("UTC")
    outputFormat.timeZone = TimeZone.getTimeZone(TimeZone.getDefault().id)
    var date: Date? = null
    var str: String = ""

    try {
        date = inputFormat.parse(day)
        str = outputFormat.format(date)
    } catch (e: ParseException) {
        e.printStackTrace()
    }

    return str
}

fun convertProfessionalDate(day: String): String {
    val inputPattern = "yyyy-MM-dd hh:mm:ss"
    val outputPattern = "yyyy-MM-dd hh:mm:ss"
    val inputFormat = SimpleDateFormat(inputPattern, Locale.getDefault())
    val outputFormat = SimpleDateFormat(outputPattern, Locale.getDefault())
    inputFormat.timeZone = TimeZone.getTimeZone(TimeZone.getDefault().id)
    outputFormat.timeZone = TimeZone.getTimeZone("UTC")
    var date: Date? = null
    var str: String = ""

    try {
        date = inputFormat.parse(day)
        str = outputFormat.format(date)
    } catch (e: ParseException) {
        e.printStackTrace()
    }

    return str
}

fun convertLocalDate(day: String): String {
    val inputPattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
    val outputPattern = "EEE dd MMM, hh:mm a"
    val inputFormat = SimpleDateFormat(inputPattern, Locale.getDefault())
    val outputFormat = SimpleDateFormat(outputPattern, Locale.getDefault())
    inputFormat.timeZone = TimeZone.getTimeZone("UTC")
    outputFormat.timeZone = TimeZone.getTimeZone(TimeZone.getDefault().id)
    var date: Date? = null
    var str: String = ""

    try {
        date = inputFormat.parse(day)
        str = outputFormat.format(date)
    } catch (e: ParseException) {
        e.printStackTrace()
    }

    return str
}

fun convertTime(day: String): String {
    val inputPattern = "yyyy-MM-dd hh:mm:ss"
    val outputPattern = "hh:mm aa"
    val inputFormat = SimpleDateFormat(inputPattern, Locale.getDefault())
    val outputFormat = SimpleDateFormat(outputPattern, Locale.getDefault())
    inputFormat.timeZone = TimeZone.getTimeZone("UTC")
    outputFormat.timeZone = TimeZone.getTimeZone(TimeZone.getDefault().id)
    var date: Date? = null
    var str: String = ""

    try {
        date = inputFormat.parse(day)
        str = outputFormat.format(date)
    } catch (e: ParseException) {
        e.printStackTrace()
    }

    return str
}

fun formatDate(date: String, initialFormat: String, targetFormat: String): String {
    var formatter = SimpleDateFormat(initialFormat, Locale.US)
    val obj = formatter.parse(date)
    formatter = SimpleDateFormat(targetFormat, Locale.US)
    return formatter.format(obj)
}

fun millisecondFromDate(date: String?): Long {
    //String date_ = date;
    val sdf = SimpleDateFormat("hh:mm aa")
    try {
        sdf.timeZone = TimeZone.getTimeZone("UTC")
        val mDate = sdf.parse(date)
        val timeInMilliseconds: Long = mDate.time
        println("Date in milli :: $timeInMilliseconds")
        return timeInMilliseconds
    } catch (e: ParseException) {
        e.printStackTrace()
    }
    return 0
}

fun millisecondFromDate3(date: Int?): Long {
    //String date_ = date;
    val sdf = SimpleDateFormat("hh")
    try {
        val mDate: Date = sdf.parse(date.toString())
        val timeInMilliseconds: Long = mDate.time
        println("Date in milli :: $timeInMilliseconds")
        return timeInMilliseconds
    } catch (e: ParseException) {
        e.printStackTrace()
    }
    return 0
}

fun millisecondFromDate2(date: String?): Long {


    //String date_ = date;
    val sdf = SimpleDateFormat("HH:mm:ss")
    try {
        sdf.timeZone = TimeZone.getTimeZone("UTC")
        val date = sdf.parse(date)
        val timeInMilliseconds: Long = date.time
        println("Date in milli :: $timeInMilliseconds")
        return timeInMilliseconds
    } catch (e: ParseException) {
        e.printStackTrace()
    }
    return 0
}

fun milliseconds(date: String?): Long {
    //String date_ = date;
    val sdf = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ")
    try {
        sdf.timeZone = TimeZone.getTimeZone("UTC")
        val mDate = sdf.parse(date)
        val timeInMilliseconds: Long = mDate.time
        println("Date in milli :: $timeInMilliseconds")
        return timeInMilliseconds
    } catch (e: ParseException) {
        e.printStackTrace()
    }
    return 0
}

fun milliDateseconds(date: String?): Long {
    //String date_ = date;
    val sdf = SimpleDateFormat("yyyy-MM-dd")
    try {
        sdf.timeZone = TimeZone.getTimeZone("UTC")
        val mDate = sdf.parse(date)
        val timeInMilliseconds: Long = mDate.time
        println("Date in milli :: $timeInMilliseconds")
        return timeInMilliseconds
    } catch (e: ParseException) {
        e.printStackTrace()
    }
    return 0
}

fun String.toDate(
    dateFormat: String = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
    timeZone: TimeZone = TimeZone.getTimeZone("Local")
): Date {
    val parser = SimpleDateFormat(dateFormat, Locale.getDefault())
    parser.timeZone = timeZone
    return parser.parse(this)
}

fun isPreviousDay(currentTimeZone: Date?): Boolean {
    var previousdate = false
    val c1: Calendar = Calendar.getInstance() // today
    c1.add(Calendar.DAY_OF_YEAR, -1) // yesterday
    val c2: Calendar = Calendar.getInstance()
    c2.time = currentTimeZone
    return if (c1.get(Calendar.YEAR) == c2.get(Calendar.YEAR)
        && c1.get(Calendar.DAY_OF_YEAR) == c2.get(Calendar.DAY_OF_YEAR)
    ) {
        true.also { previousdate = it }
    } else {
        false.also { previousdate = it }
    }
}

fun Date.formatTo(dateFormat: String, timeZone: TimeZone = TimeZone.getDefault()): String {
    val formatter = SimpleDateFormat(dateFormat, Locale.getDefault())
    formatter.timeZone = timeZone
    return formatter.format(this)
}

fun uTCToLocal(
    dateFormatInPut: String,
    dateFomratOutPut: String,
    datesToConvert: String
): String {
    val isoFormat = SimpleDateFormat(datesToConvert)
    val date = isoFormat.parse(dateFormatInPut)

    val now = Calendar.getInstance()
    val yesterday = Calendar.getInstance().apply { add(Calendar.DATE, -1) }
    val inputDate = Calendar.getInstance().apply { time = date }

    return if (inputDate[Calendar.YEAR] == now[Calendar.YEAR] && inputDate[Calendar.DAY_OF_YEAR] == now[Calendar.DAY_OF_YEAR]) {
        convertTime(dateFormatInPut).replace("am", "AM")
            .replace("pm", "PM")
    } else if (inputDate[Calendar.YEAR] == yesterday[Calendar.YEAR] && inputDate[Calendar.DAY_OF_YEAR] == yesterday[Calendar.DAY_OF_YEAR]) {
        ("${
            convertTime(dateFormatInPut).replace("am", "AM")
            .replace("pm", "PM")}, Yesterday")
    } else {
        convertDate(dateFormatInPut)
    }
}

fun convertDatesFormat2(day: String): String {
    val inputPattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
    val outputPattern = "EEE dd MMM,yyyy"
    val inputFormat = SimpleDateFormat(inputPattern)
    val outputFormat = SimpleDateFormat(outputPattern)
    var date: Date? = null
    var str: String = ""

    try {
        date = inputFormat.parse(day)
        str = outputFormat.format(date)
    } catch (e: ParseException) {
        e.printStackTrace()
    }

    return str
}

fun getAttachmentFilePart(file: Bitmap, name: String): MultipartBody.Part {
    var byteArray: ByteArray? = null
    val oritation = 0// getCameraPhotoOrientation(file.absolutePath)
    try {
        var bitmap = file
        //  var bitmap =  file//Uri.fromFile(file).getBitMap(mContext!!)// BitmapFactory.decodeFile(file.path)
        val stream = ByteArrayOutputStream()
        val matrix = Matrix()
        matrix.postRotate(oritation.toFloat())
        bitmap = Bitmap.createBitmap(bitmap, 0, 0, bitmap.width, bitmap.height, matrix, true)
        bitmap.compress(Bitmap.CompressFormat.JPEG, 50, stream)
        byteArray = stream.toByteArray()
    } catch (t: Throwable) {
        t.printStackTrace()
    }

    // val bmp: Bitmap = intent.getExtras().get("data")
    val filePart = MultipartBody.Part.createFormData(
        name,
        System.currentTimeMillis().toString(),
        RequestBody.create("image/*".toMediaTypeOrNull(), byteArray!!)
        //   file.asRequestBody("image/*".toMediaTypeOrNull())
        //
        //   RequestBody.create(file,"image/*".toMediaTypeOrNull())
    )

    return filePart
}


fun uTCToLocalList(
    dateFormatInPut: String,
    dateFomratOutPut: String,
    datesToConvert: String
): String {
    val isoFormat = SimpleDateFormat(datesToConvert)
    val date = isoFormat.parse(dateFormatInPut)

    val now = Calendar.getInstance()
    val yesterday = Calendar.getInstance().apply { add(Calendar.DATE, -1) }
    val inputDate = Calendar.getInstance().apply { time = date }

    return if (inputDate[Calendar.YEAR] == now[Calendar.YEAR] && inputDate[Calendar.DAY_OF_YEAR] == now[Calendar.DAY_OF_YEAR]) {
        convertTime(dateFormatInPut).replace("am", "AM")
            .replace("pm", "PM")
    } else if (inputDate[Calendar.YEAR] == yesterday[Calendar.YEAR] && inputDate[Calendar.DAY_OF_YEAR] == yesterday[Calendar.DAY_OF_YEAR]) {
        ("Yesterday")
    } else {
        convertDateList(dateFormatInPut)
    }
}

fun convertDateList(day: String): String {
    val inputPattern = "yyyy-MM-dd hh:mm:ss"
    val outputPattern = "EEE dd MMM, yyyy"
    val inputFormat = SimpleDateFormat(inputPattern, Locale.getDefault())
    val outputFormat = SimpleDateFormat(outputPattern, Locale.getDefault())
    inputFormat.timeZone = TimeZone.getTimeZone("UTC")
    outputFormat.timeZone = TimeZone.getTimeZone(TimeZone.getDefault().id)
    var date: Date? = null
    var str: String = ""

    try {
        date = inputFormat.parse(day)
        str = outputFormat.format(date)
    } catch (e: ParseException) {
        e.printStackTrace()
    }

    return str
}

fun convertUTCLocal(date1: String): String {
    val inputPattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
    val outputPattern = "EEE dd MMM, hh:mm a"
    val inputFormat = SimpleDateFormat(inputPattern, Locale.getDefault())
    val outputFormat = SimpleDateFormat(outputPattern, Locale.getDefault())
    inputFormat.timeZone = TimeZone.getTimeZone("UTC")
    outputFormat.timeZone = TimeZone.getTimeZone(TimeZone.getDefault().id)
    var date: Date? = null
    var str: String = ""

    try {
        date = inputFormat.parse(date1)
        str = outputFormat.format(date)
    } catch (e: ParseException) {
        e.printStackTrace()
    }

    return str
}


fun convertDatesFormat(day: String): String {
    val inputPattern = "yyyy-MM-dd hh:mm:ss"
    val outputPattern = "yyyy-MM-dd hh:mm a"
    val inputFormat = SimpleDateFormat(inputPattern)
    val outputFormat = SimpleDateFormat(outputPattern)
    inputFormat.timeZone = TimeZone.getTimeZone("UTC")
    var date: Date? = null
    var str: String = ""

    try {
        date = inputFormat.parse(day)
        str = outputFormat.format(date)
    } catch (e: ParseException) {
        e.printStackTrace()
    }

    return str
}


fun ImageView.loadImage(
    imageUrl: Any?,
    errorResId: Int?
) {

    if (context == null) return
    if (imageUrl == null) return
    if (errorResId == null) return

    val circularProgressDrawable = CircularProgressDrawable(context)
    circularProgressDrawable.strokeWidth = 5f
    circularProgressDrawable.centerRadius = 30f
    circularProgressDrawable.start()

    Glide.with(context)
        .load(imageUrl)
        .thumbnail(0.3f)
        .placeholder(circularProgressDrawable)
        .error(errorResId)
        .into(this)
}



@SuppressLint("HardwareIds")
fun getDeviceId(context: Context): String {
    return Settings.Secure.getString(
        context.contentResolver, Settings.Secure.ANDROID_ID
    )
}

fun showSoftKeyboard(context: Context, view: View) {
    if (view.requestFocus()) {
        val imm: InputMethodManager =
            context.getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
        imm.showSoftInput(view, InputMethodManager.SHOW_IMPLICIT)
    }
}

fun ScrollView.scrollToBottom() {
    val lastChild = getChildAt(childCount - 1)
    val bottom = lastChild.bottom + paddingBottom
    val delta = bottom - (scrollY + height)
    smoothScrollBy(0, delta)
}


// Get Activity Context from Any View
fun Context.getParentActivity(): AppCompatActivity? {
    var context = this
    while (context is ContextWrapper) {
        if (context is AppCompatActivity) {
            return context
        }
        context = context.baseContext
    }
    return null
}

// Do Back from Any View
fun View.doBack() {
    setOnClickListener {
        if (this.context is Activity) {
            val activity = this.context as Activity
            activity.onBackPressed()
        }
    }
}


// To clear Livedata Values
fun MutableLiveData<String>.doClear() {
    this.value = ""
}

// Visibility
fun View.doGone() {
    visibility = View.GONE
}

// Visibility
fun View.doInvisible() {
    visibility = View.INVISIBLE
}

fun View.doVisible() {
    visibility = View.VISIBLE
}

// To Show Toast
var toast: Toast? = null
fun AppCompatActivity.showToast(message: String) {
    if (toast != null) toast!!.cancel()
    toast = Toast.makeText(this, message, Toast.LENGTH_SHORT)
    toast?.show()
}

// To Show Toast
fun Context.showToast(message: String) {
    if (toast != null) toast!!.cancel()
    toast = Toast.makeText(this, message, Toast.LENGTH_SHORT)
    toast?.show()
}

fun Fragment.err_limit_fullNameshowToast(message: String) {
    if (toast != null) toast!!.cancel()
    toast = Toast.makeText(this.activity, message, Toast.LENGTH_SHORT)
    toast?.show()
}

// To Get String from View
fun EditText.getString(): String {
    return this.text.toString().trim()
}

fun TextView.getString(): String {
    return this.text.toString().trim()
}

fun String.getString(): String {
    return this.trim()
}