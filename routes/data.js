var connection = require('./../dbconnection');
var dateFormat = require('dateformat');
module.exports = (app) => {
    app.get('/data/:slug', async (req, res) => {
        const slug = req.params.slug
        var now = new Date();
        if (slug == 'savestreamlog') {
            start_at = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
            stream_id = req.query.stream_id;
            sql = "insert into stream_log(stream_id,start_at,update_on) values('" + stream_id + "','" + start_at + "','" + start_at + "')";

            connection.query(sql, function (err, result) {

                if (err) {
                    response = {
                        status: false,
                        message: 'there are some error with query'
                    };
                    return res.send(response);

                } else {
                    return   response = {
                        status: 1,
                        message: "Attendees joined successfuly"
                    };

                    return res.send(response);

                }

            });
        }
        
        if (slug == 'updatestreamlog') {
            update_on = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
            stream_id = req.query.stream_id;
            sql = "update stream_log set update_on='"+update_on+"' where stream_id='"+stream_id+"'"
            //sql = "insert into stream_log(stream_id,start_at,update_on) values('" + stream_id + "','" + start_at + "','" + start_at + "')";
                
            await connection.query(sql, function (err, result) {
                //console.log(err);
                //console.log(result);
                  response = {
                        status: 1,
                        message: "Stream updated successfuly"
                    };

                    return res.send(response);

            });
        }

        if (slug == 'getstreamlog') {
            response = '';
            await connection.query('select * from stream_log group by stream_id order by id desc', function (err, results) {

                if (err) {
                    response = {
                        status: false,
                        data: []
                    };
                    return res.send(response);

                } else {
                    response = {
                        status: 1,
                        data: results
                    };

                    return res.send(response);
                }



            });

            console.log(response);
        }
    })
}
