$(document).ready(function()
{
    $('input#sts').click(function(){ $.post('/submit/', { "profondita"        : $('textarea[name=profondita]').text(),
     		    					                      "timeout"           : $('textarea[name=timeout]').text(),
     		    				                          "url"               : $('textarea[name=input]').text(),
                                                          "Turisti_per_caso"  : $('input.opt1').is(':checked'),
                                                          "Vbulletin_Topic"   : $('input.opt2').is(':checked'),
                                                          "Vbulletin_Section" : $('input.opt3').is(':checked'),
                                                          "Yahoo_Answer"      : $('input.opt4').is(':checked'),
                                                          "All_Ahref"         : $('input.opt5').is(':checked'),
                                                          "DiffBot"           : $('input.opt6').is(':checked')
                                                        })})
});
                                                            
