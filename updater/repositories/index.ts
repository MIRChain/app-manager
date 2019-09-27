import GithubRepo from './Github'
import AzureRepo from './Azure'
import BintrayRepo from './Bintray'
import { IRelease } from '../api/IRelease'

export const getRepository = (urlString : string, modifiers? : any, filter? : any, prefix? : string) => {
  if(urlString.startsWith('https://github.com/')) {
    return new GithubRepo(urlString, {
      filter,
      prefix
    })
  }
  else if(urlString.startsWith('https://bintray.com')){
    return new BintrayRepo(urlString, {
      filter
    })
  }
  else if(urlString.includes('blob.core.windows.net')){
    if(modifiers){
      let mod = (release : IRelease) => {
        let result : {[key:string] : any} = { }
        for(var m in modifiers){
          result[m] = modifiers[m](release)
        }
        return result
      }
      return new AzureRepo(urlString, {
        onReleaseParsed: mod,
        filter,
        prefix
      })      
    } else {
      return new AzureRepo(urlString, {
        filter,
        prefix
      })
    }
  }
  /*
  else if(urlString.includes('bzz:')){
    return new SwarmRepo(urlString)
  }
  */
  else {
    throw new Error('No repository strategy found for url: ' + urlString)
  }
}