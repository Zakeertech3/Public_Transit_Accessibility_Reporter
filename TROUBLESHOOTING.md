# 🔧 Vercel Deployment Troubleshooting Guide

## Common Error Codes and Solutions

### 1. FUNCTION_INVOCATION_FAILED (500)

**Symptoms:** API endpoints return 500 errors
**Causes:**

- Python syntax errors in API functions
- Missing dependencies in requirements.txt
- Runtime errors in serverless functions

**Solutions:**

1. Check Vercel function logs in dashboard
2. Test API endpoints locally first
3. Verify all imports are available in requirements.txt

### 2. NOT_FOUND (404)

**Symptoms:** API endpoints return 404 errors
**Causes:**

- Incorrect routing in vercel.json
- Missing API files
- Wrong file structure

**Solutions:**

1. Verify API files exist in `/api/` directory
2. Check vercel.json routes configuration
3. Ensure file names match route destinations

### 3. FUNCTION_INVOCATION_TIMEOUT (504)

**Symptoms:** Requests timeout after 10 seconds
**Causes:**

- Long-running operations in serverless functions
- Infinite loops or blocking operations
- Large file processing

**Solutions:**

1. Optimize function performance
2. Use async operations where possible
3. Implement proper error handling

### 4. Function Runtime Version Error

**Symptoms:** `Function Runtimes must have a valid version, for example 'now-php@1.0.0'`
**Causes:**

- Incorrect runtime specification in vercel.json
- Using deprecated runtime format
- Vercel expecting versioned runtime specification

**Solutions:**

1. Use modern `rewrites` instead of `functions` in vercel.json
2. Let Vercel auto-detect Python runtime
3. Use minimal configuration without explicit runtime
4. Add runtime.txt file for Python version specification

### 5. CORS Issues

**Symptoms:** Browser console shows CORS errors
**Causes:**

- Missing CORS headers in API responses
- Incorrect Access-Control headers

**Solutions:**

1. Add proper CORS headers to all API responses
2. Handle OPTIONS preflight requests
3. Use wildcard (\*) for development

## Quick Diagnostic Steps

### Step 1: Test API Endpoints

After deployment, test these URLs:

1. **Health Check:** `https://your-app.vercel.app/api/health`

   - Should return: `{"status": "healthy", "service": "Transit Accessibility Reporter API"}`

2. **Test Endpoint:** `https://your-app.vercel.app/api/test`

   - Should return: `{"message": "API is working!", ...}`

3. **Reports Endpoint (GET):** `https://your-app.vercel.app/api/reports`
   - Should return: `{"reports": []}`

### Step 2: Check Vercel Logs

1. Go to Vercel Dashboard
2. Select your project
3. Click on "Functions" tab
4. Check logs for any errors

### Step 3: Test Frontend

1. Open browser developer tools (F12)
2. Go to Network tab
3. Try submitting a report
4. Check for failed requests and error messages

## Error-Specific Solutions

### If you see "Failed to fetch" in browser:

```javascript
// This usually means the API endpoint is not responding
// Check these URLs directly in browser:
https://your-app.vercel.app/api/health
https://your-app.vercel.app/api/reports
```

### If you see CORS errors:

```
Access to fetch at 'https://your-app.vercel.app/api/reports'
from origin 'https://your-app.vercel.app' has been blocked by CORS policy
```

**Solution:** The API functions should already include CORS headers. If this persists, check the function logs.

### If you see 404 errors on API calls:

1. Verify vercel.json routing is correct
2. Check that API files exist in the `/api/` directory
3. Ensure file names match exactly (case-sensitive)

### If deployment fails:

1. Check build logs in Vercel dashboard
2. Verify requirements.txt has all needed dependencies
3. Check for Python syntax errors in API files

## Testing Commands

### Local Testing (before deployment):

```bash
# Test if Python files have syntax errors
python -m py_compile api/health.py
python -m py_compile api/reports.py
python -m py_compile api/test.py

# Check requirements.txt
pip install -r requirements.txt
```

### After Deployment Testing:

```bash
# Test health endpoint
curl https://your-app.vercel.app/api/health

# Test reports endpoint
curl https://your-app.vercel.app/api/reports

# Test POST to reports
curl -X POST https://your-app.vercel.app/api/reports \
  -H "Content-Type: application/json" \
  -d '{"category":"Test","latitude":40.7128,"longitude":-74.0060,"description":"Test report"}'
```

## Current Configuration Status

✅ **Fixed Issues:**

- API functions converted to Vercel-compatible format
- CORS headers added to all endpoints
- Proper error handling implemented
- Test endpoint created for debugging

✅ **Vercel Configuration:**

- vercel.json properly configured for serverless functions
- Routes set up for all API endpoints
- Frontend routing configured

✅ **Requirements:**

- requirements.txt created with necessary dependencies
- Python 3.9 runtime specified

## Next Steps

1. **Deploy to Vercel** with the updated configuration
2. **Test the API endpoints** using the URLs above
3. **Check Vercel logs** if any errors occur
4. **Test the frontend** by submitting a report

If you encounter specific errors, check the Vercel function logs and match them against the error codes in your original message.
