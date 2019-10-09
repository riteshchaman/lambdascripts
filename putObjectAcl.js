//Bibliography
//Massaged from William Tsoi code from https://gist.github.com/williamtsoi1/104531c65852a852399a3dc1096a2dcc
//API - https://docs.aws.amazon.com/cli/latest/reference/s3api/put-object-acl.html
//Class and examples - https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObjectAcl-property

const AWS = require('aws-sdk');
const util = require('util');

// Permissions for the new objects
// Key MUST match the top level folder
// Format: <owner account name> - <Canonical ID> - <sub account name> - <canonical ID>
// This will give owner full permission & sub account read only permission

// Main Loop
exports.handler = function(event, context, callback) {
    console.log(event);
    
    var srcKey = event.Records[0].s3.object.key;
    console.log(srcKey);
    
	//Hard code your bucket name
	var srcBucket = '<your bucket name>';
    
    
    // If its an object delete, do nothing
    if (event.RequestType === 'Delete') {
    }
    else // Its an object put
    {
        // Get the source bucket from the S3 event
        //var srcBucket = event.Records[0].s3.bucket.name;

        // Object key may have spaces or unicode non-ASCII characters, decode it
        //var srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));  

        // Gets the top level folder, which is the key for the permissions array   
        
        var folderID = srcKey.split("/")[0];
        
        var sourcekeyout = 'Source key name is ' + srcKey;
        var sourcebucketout = 'Source bucket name is ' + srcBucket;
        var sourcefolderidout = 'Source folderid name is ' + folderID;
        

        console.log(sourcekeyout);
        console.log(sourcebucketout);
        console.log(sourcefolderidout);
        
        
        // Define the object permissions, using the permissions array
        var params =
        {
            Bucket: srcBucket,
            Key: srcKey,
            AccessControlPolicy:
            {
                'Owner':
                {
                    'DisplayName': 'AWSBilling',
                    'ID': 'Canoninal Id of AWS billing account'
                },
                'Grants': 
                [
                    {
                        'Grantee': 
                        {
                            'Type': 'CanonicalUser',
                            'DisplayName': 'Master',
                            'ID': 'Canoninal Id of your master account'
                        },
                        'Permission': 'FULL_CONTROL'
                    },
                    {
                        'Grantee': {
                            'Type': 'CanonicalUser',
                            'DisplayName': 'Member',
                            'ID': 'Canoninal Id of your member account'
                            },
                        'Permission': 'READ'
                    },
                ]
            }
        };

        // get reference to S3 client 
        var s3 = new AWS.S3();

        // Put the ACL on the object
        s3.putObjectAcl(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
        });
    }
 };


